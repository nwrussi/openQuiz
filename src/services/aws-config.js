import AWS from 'aws-sdk'

// AWS Configuration
// These values should be set via environment variables in production
const AWS_CONFIG = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
}

// Initialize AWS SDK
if (AWS_CONFIG.accessKeyId && AWS_CONFIG.secretAccessKey) {
  AWS.config.update(AWS_CONFIG)
}

// DynamoDB Document Client for easier data operations
export const dynamoDB = new AWS.DynamoDB.DocumentClient()

// S3 Client for file storage (deck sharing, images, etc.)
export const s3 = new AWS.S3()

// API Gateway endpoint (configure this when backend is ready)
export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'https://api.openquiz.local'

export default AWS
