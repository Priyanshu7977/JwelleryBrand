import { Pool, QueryResult, QueryResultRow } from 'pg';
import { config } from '../config/index';
import { logger } from '../utils/logger';

let pool: Pool | null = null;
let isPostgresAvailable = false;

export function getDbPool(): Pool | null {
  if (!pool && config.databaseUrl) {
    try {
      pool = new Pool({
        connectionString: config.databaseUrl,
        ssl: config.databaseUrl.includes('supabase') || config.databaseUrl.includes('pooler') ? { rejectUnauthorized: false } : undefined,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });

      pool.on('error', (err) => {
        logger.warn('Postgres connection pool idle client error:', err);
      });
    } catch (err) {
      logger.warn('Could not initialize Postgres pool:', err);
    }
  }
  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const p = getDbPool();
  if (!p) {
    throw new Error('Database pool not initialized');
  }
  const start = Date.now();
  const res = await p.query<T>(text, params);
  const duration = Date.now() - start;
  logger.debug('Executed query', { text, duration, rows: res.rowCount });
  return res;
}

export async function testConnection(): Promise<boolean> {
  try {
    const p = getDbPool();
    if (!p) return false;
    const res = await p.query('SELECT 1 as connected');
    isPostgresAvailable = res.rows.length > 0;
    if (isPostgresAvailable) {
      logger.info('Connected to PostgreSQL database successfully.');
    }
    return isPostgresAvailable;
  } catch (err) {
    logger.info('Running on Resilient Atelier High-Performance Repository Store.');
    isPostgresAvailable = false;
    return false;
  }
}

export function isDbConnected(): boolean {
  return isPostgresAvailable;
}
