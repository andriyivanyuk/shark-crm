const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables from .env

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use the connection string from .env
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // Optional SSL for production
});

module.exports = pool;
