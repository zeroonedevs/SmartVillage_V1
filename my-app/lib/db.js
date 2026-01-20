import { Pool } from 'pg';

// Ideally, this should be in .env.local
// process.env.DATABASE_URL
// For now, the user will paste the connection string here directly or we can set it up to read from env.
// Let's set it up to prefer env but user can hardcode if they insist.

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true, // Neon needs SSL
});

console.log(`Database pool initialized using connection string: ${process.env.DATABASE_URL ? 'Filled (masked)' : 'MISSING'}`);

pool.on('connect', () => {
    console.log('Database connected successfully');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

export default pool;
