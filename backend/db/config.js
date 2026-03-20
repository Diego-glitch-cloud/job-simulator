const { Pool } = require('pg');

// Esto lee de archivo local o de variables del sistema en Docker
require('dotenv').config();

// Creamos el cliente Pool hacia la BD (PostgreSQL) usando las variables según el checklist Senior
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'job_simulator',
  max: 20, // Conexiones concurrentes máximas
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Ha ocurrido un error inesperado al conectar con PostgreSQL:', err);
});

module.exports = {
  // Función puente para ejecutar las promesas de la consulta
  query: (text, params) => pool.query(text, params),
};
