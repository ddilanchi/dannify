#!/usr/bin/env node

/**
 * Auto-fetch latest AI models from Anthropic, OpenAI, and Google Gemini
 * Updates the MODELS object in index.html
 *
 * Usage: node update-models.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEYS = {
  openai: process.env.OPENAI_API_KEY,
  anthropic: process.env.ANTHROPIC_API_KEY,
  gemini: process.env.GOOGLE_API_KEY,
};

const DRY_RUN = process.argv.includes('--dry-run');

/**
 * Fetch models from OpenAI API
 */
async function fetchOpenAIModels() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.openai.com',
      path: '/v1/models',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEYS.openai}`,
      },
    };

    https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const models = json.data
            .filter(m => m.id.includes('gpt') || m.id.includes('o1') || m.id.includes('o4'))
            .map(m => ({
              id: m.id,
              name: m.id.replace(/-/g, ' ').toUpperCase(),
            }))
            .sort((a, b) => a.id.localeCompare(b.id));
          resolve(models);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject).end();
  });
}

/**
 * Fetch models from Anthropic (manual list - no public API)
 */
async function fetchAnthropicModels() {
  // Anthropic doesn't provide a public models list endpoint
  // Return manually maintained list of known models
  return [
    { id: 'claude-4-6-20250514', name: 'Claude 4.6 (latest)' },
    { id: 'claude-4-6-sonnet-20250514', name: 'Claude 4.6 Sonnet' },
    { id: 'claude-4-5-20250514', name: 'Claude 4.5' },
    { id: 'claude-opus-4-6-20250514', name: 'Claude Opus 4.6' },
    { id: 'claude-sonnet-4-6-20250514', name: 'Claude Sonnet 4.6' },
    { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5 (fastest/cheapest)' },
  ];
}

/**
 * Fetch models from Google Gemini API
 */
async function fetchGeminiModels() {
  return new Promise((resolve, reject) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEYS.gemini}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const models = json.models
            .filter(m => m.name.includes('gemini'))
            .map(m => ({
              id: m.name.replace('models/', ''),
              name: m.displayName || m.name.replace('models/', ''),
            }))
            .sort((a, b) => a.id.localeCompare(b.id));
          resolve(models);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Generate JavaScript code for MODELS object
 */
function generateModelsJS(models) {
  const entries = Object.entries(models)
    .map(([provider, list]) => {
      const items = list
        .map(m => `        { id: '${m.id}', name: '${m.name}' }`)
        .join(',\n');
      return `      ${provider}: [\n${items},\n      ]`;
    })
    .join(',\n');

  return `const MODELS = {\n${entries},\n    };`;
}

/**
 * Update index.html with new models
 */
function updateIndexHTML(modelsJS) {
  const indexPath = path.join(__dirname, 'index.html');
  let content = fs.readFileSync(indexPath, 'utf-8');

  // Find and replace the MODELS object
  const pattern = /const MODELS = \{[\s\S]*?\};/;
  const updated = content.replace(pattern, modelsJS);

  if (updated === content) {
    console.error('❌ Could not find MODELS object in index.html');
    process.exit(1);
  }

  if (!DRY_RUN) {
    fs.writeFileSync(indexPath, updated, 'utf-8');
    console.log('✅ Updated index.html');
  } else {
    console.log('\n📋 Dry-run mode: Would update index.html with:');
    console.log(modelsJS);
  }
}

/**
 * Main
 */
async function main() {
  console.log('🔄 Fetching latest AI models...\n');

  try {
    let models = {};

    console.log('📍 Anthropic models...');
    models.anthropic = await fetchAnthropicModels();
    console.log(`   Found ${models.anthropic.length} models`);

    if (API_KEYS.openai) {
      console.log('📍 OpenAI models...');
      try {
        models.openai = await fetchOpenAIModels();
        console.log(`   Found ${models.openai.length} models`);
      } catch (e) {
        console.warn(`   ⚠️  Failed to fetch: ${e.message}`);
      }
    } else {
      console.warn('⚠️  OPENAI_API_KEY not set, skipping OpenAI models');
    }

    if (API_KEYS.gemini) {
      console.log('📍 Gemini models...');
      try {
        models.gemini = await fetchGeminiModels();
        console.log(`   Found ${models.gemini.length} models`);
      } catch (e) {
        console.warn(`   ⚠️  Failed to fetch: ${e.message}`);
      }
    } else {
      console.warn('⚠️  GOOGLE_API_KEY not set, skipping Gemini models');
    }

    const modelsJS = generateModelsJS(models);
    updateIndexHTML(modelsJS);

    console.log('\n✨ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
