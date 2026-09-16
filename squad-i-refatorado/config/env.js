require('dotenv').config();

module.exports = {
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  port: Number(process.env.PORT) || 3000,
};
