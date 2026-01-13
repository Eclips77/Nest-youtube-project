import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),

  // Database Configuration
  DB_TYPE: Joi.string().valid('MONGO', 'JSON').required(),
  MONGO_URI: Joi.string().when('DB_TYPE', {
    is: 'MONGO',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  JSON_DB_PATH: Joi.string().default('./data'),

  // Storage Configuration
  STORAGE_TYPE: Joi.string().valid('FS', 'S3').required(),
  AWS_ACCESS_KEY_ID: Joi.string().when('STORAGE_TYPE', {
    is: 'S3',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  AWS_SECRET_ACCESS_KEY: Joi.string().when('STORAGE_TYPE', {
    is: 'S3',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  AWS_BUCKET_NAME: Joi.string().when('STORAGE_TYPE', {
    is: 'S3',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  AWS_REGION: Joi.string().when('STORAGE_TYPE', {
    is: 'S3',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  // ElasticSearch Configuration
  ELASTICSEARCH_NODE: Joi.string().required(),
  ELASTICSEARCH_INDEX: Joi.string().default('video-platform-logs'),
});
