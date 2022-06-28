import * as dotenv from 'dotenv';
dotenv.config();

export const EMAIL_SERVICE = process.env.EMAIL_SERVICE;
export const EMAIL_AUTH_USER = process.env.EMAIL_AUTH_USER;
export const EMAIL_AUTH_PASSWORD = process.env.EMAIL_AUTH_PASSWORD;
export const EMAIL_BASE_URL = process.env.EMAIL_BASE_URL;
