import OpenAI from 'openai';
import 'dotenv/config';
import { AIService } from './services/aiService.js';

const testData = {
  category: 'anxiety',
  title: 'Work Stress',
  description: 'I feel overwhelmed with my current workload and deadlines',
  severity: 7
};

console.log('Testing ChatGPT API with problem data...\n');
try {
  const response = await AIService.generateAffirmations(testData);
  console.log('✓ Success! Generated affirmations:');
  console.log(JSON.stringify(response, null, 2));
} catch (error) {
  console.error('✗ Error:', error.message);
}
