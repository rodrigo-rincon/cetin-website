import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import pg from 'pg';

const { Pool } = pg;
const secrets = new SecretsManagerClient({});
let poolPromise;

async function createPool() {
  const result = await secrets.send(new GetSecretValueCommand({ SecretId: process.env.DB_SECRET_ARN }));
  const credentials = JSON.parse(result.SecretString || '{}');
  const pool = new Pool({
    host: credentials.host || process.env.DB_HOST,
    port: Number(credentials.port || process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || credentials.dbname || credentials.database,
    user: credentials.username || credentials.user,
    password: credentials.password,
    max: 2,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false },
  });
  pool.on('error', (error) => console.error('Unexpected PostgreSQL pool error', error));
  return pool;
}

async function getPool() {
  poolPromise ||= createPool();
  return poolPromise;
}

export async function execute(sql, parameters = []) {
  const pool = await getPool();
  const result = await pool.query(sql, parameters);
  return result.rows;
}
