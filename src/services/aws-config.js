// AWS Configuration
// These values should be set via environment variables in production
const AWS_CONFIG = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
}

// Lazy-load AWS SDK only when credentials are available
let AWS = null
let dynamoDBInstance = null
let s3Instance = null

// Initialize AWS SDK only when credentials are provided
const initializeAWS = async () => {
  if (!AWS && AWS_CONFIG.accessKeyId && AWS_CONFIG.secretAccessKey) {
    try {
      AWS = (await import('aws-sdk')).default
      AWS.config.update(AWS_CONFIG)
      dynamoDBInstance = new AWS.DynamoDB.DocumentClient()
      s3Instance = new AWS.S3()
    } catch (error) {
      console.warn('AWS SDK not available or failed to initialize:', error)
    }
  }
}

// Export getters that initialize on-demand
export const getDynamoDB = async () => {
  await initializeAWS()
  return dynamoDBInstance
}

export const getS3 = async () => {
  await initializeAWS()
  return s3Instance
}

// Mock implementations for when AWS is not available
export const dynamoDB = {
  query: () => ({ promise: () => Promise.reject(new Error('AWS not configured')) }),
  get: () => ({ promise: () => Promise.reject(new Error('AWS not configured')) }),
  put: () => ({ promise: () => Promise.reject(new Error('AWS not configured')) }),
  update: () => ({ promise: () => Promise.reject(new Error('AWS not configured')) }),
  delete: () => ({ promise: () => Promise.reject(new Error('AWS not configured')) }),
}

export const s3 = {
  putObject: () => ({ promise: () => Promise.reject(new Error('AWS not configured')) }),
  getObject: () => ({ promise: () => Promise.reject(new Error('AWS not configured')) }),
}

// API Gateway endpoint (configure this when backend is ready)
export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'https://api.openquiz.local'
