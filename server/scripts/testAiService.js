import dotenv from 'dotenv';
import { classifyComplaint, analyzeImage, getEmbedding } from '../services/aiService.js';

dotenv.config();

async function run() {
  console.log('==============================================');
  console.log('Testing AI Service Layer (Gemini Integration)');
  console.log('==============================================');

  const sampleComplaint =
    'The village community hand pump near Kanke school has been broken for 3 weeks, leaving 50 families without clean drinking water.';

  console.log('\n1. Testing classifyComplaint()...');
  console.log('Input Text:', sampleComplaint);
  const classification = await classifyComplaint(sampleComplaint);
  console.log('Classification Result:', JSON.stringify(classification, null, 2));

  console.log('\n2. Testing analyzeImage()...');
  const sampleImageUrl = 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg';
  const visionAnalysis = await analyzeImage(sampleImageUrl, sampleComplaint);
  console.log('Vision Analysis Result:', JSON.stringify(visionAnalysis, null, 2));

  console.log('\n3. Testing getEmbedding()...');
  const embedding = await getEmbedding(sampleComplaint);
  console.log('Embedding Length:', embedding.length);
  console.log('Embedding Sample (first 5 values):', embedding.slice(0, 5));

  console.log('\n==============================================');
  console.log('AI Service Layer Test Completed Successfully');
  console.log('==============================================');
}

run().catch((err) => {
  console.error('Test script error:', err);
  process.exit(1);
});
