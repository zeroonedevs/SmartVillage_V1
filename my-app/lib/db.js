import { Pool } from 'pg';

// Hardcoded database URL for deployment (since we can't set env variables on server)
// Falls back to env variable for local development
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_yhXDxe48bzqO@ep-icy-mode-a15vp7d4-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL?.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
});

console.log(`Database pool initialized using connection string: ${DATABASE_URL ? 'Connected ✅' : 'MISSING ❌'}`);

pool.on('connect', () => {
    console.log('Database connected successfully');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

export default pool;
