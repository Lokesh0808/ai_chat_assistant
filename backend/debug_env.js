import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Testing .env loading...\n');
console.log('Script location:', __filename);
console.log('Expected .env path:', join(__dirname, '.env'));
console.log('Current working directory:', process.cwd());

// Load with explicit path
const envPath = join(__dirname, '.env');
console.log('\nLoading .env from:', envPath);

const result = dotenv.config({ path: envPath });

console.log('Config result:', {
  parsed: result.parsed ? Object.keys(result.parsed) : undefined,
  error: result.error?.message
});

console.log('\nEnvironment variables after dotenv.config:');
console.log('  GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? `✓ found (${process.env.GEMINI_API_KEY.substring(0, 10)}...)` : '✗ NOT found');
console.log('  PORT:', process.env.PORT);
console.log('  NODE_ENV:', process.env.NODE_ENV);

if (!process.env.GEMINI_API_KEY) {
  console.log('\n⚠️ GEMINI_API_KEY not loaded!');
  console.log('Trying to read file directly...');
  
  import('fs').then(fs => {
    const content = fs.readFileSync(envPath, 'utf-8');
    console.log('File content:');
    console.log(content);
  });
}
