import pg from 'pg';

const { Pool } = pg;

function buildPoolConfig() {
  if (process.env.DB_HOST) {
    return {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'gtaes',
      password: process.env.DB_PASSWORD || 'gtaes',
      database: process.env.DB_NAME || 'gtaes',
    };
  }

  return {
    connectionString:
      process.env.DATABASE_URL ||
      'postgresql://gtaes:gtaes@db:5432/gtaes',
  };
}

const pool = new Pool(buildPoolConfig());

export default pool;
