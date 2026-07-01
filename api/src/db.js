import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgresql://gtaes:gtaes@db:5432/gtaes',
});

export default pool;
