import cloudinary from 'cloudinary';
import { config } from '../../config.js';

// Use values from config.js
const CLOUDINARY_CLOUD_NAME = config.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = config.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = config.CLOUDINARY_API_SECRET;

console.log('Cloudinary config from config.js:');
console.log('Cloud Name:', CLOUDINARY_CLOUD_NAME);
console.log('API Key:', CLOUDINARY_API_KEY);
console.log('API Secret:', CLOUDINARY_API_SECRET ? '******' : 'NOT SET');

// Validate configuration
if (!CLOUDINARY_CLOUD_NAME) {
  console.error('Cloudinary Configuration Error: CLOUDINARY_CLOUD_NAME is missing.');
  throw new Error('Cloudinary configuration is incomplete: Cloud Name missing.');
}
if (!CLOUDINARY_API_KEY) {
  console.error('Cloudinary Configuration Error: CLOUDINARY_API_KEY is missing.');
  throw new Error('Cloudinary configuration is incomplete: API Key missing.');
}
if (!CLOUDINARY_API_SECRET) {
  console.error('Cloudinary Configuration Error: CLOUDINARY_API_SECRET is missing.');
  throw new Error('Cloudinary configuration is incomplete: API Secret missing.');
}

// Log that configuration is being applied
console.log('Attempting to configure Cloudinary...');
cloudinary.v2.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true // It's good practice to ensure secure (HTTPS) connections
});
console.log('Cloudinary configured with provided credentials.');

// Test Cloudinary connection with explicit success/failure logs
cloudinary.v2.api.ping()
  .then((result) => {
    // Check for a specific expected result from ping (e.g., status: 'ok')
    if (result && result.status === 'ok') {
      console.log('Cloudinary connection test: SUCCESS! Status: ok');
    } else {
      console.warn('Cloudinary connection test: UNEXPECTED RESPONSE. Result:', result);
    }
  })
  .catch((error) => {
    console.error('Cloudinary connection test: FAILED!');
    console.error('Cloudinary connection error details:', error.message || error);
    // You might want to throw the error here in production if Cloudinary is critical
    // throw new Error('Cloudinary connection failed: ' + error.message);
  });

export default cloudinary.v2;