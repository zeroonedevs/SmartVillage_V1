import { Pool } from 'pg';

// Ideally, this should be in .env.local
// process.env.DATABASE_URL
// For now, the user will paste the connection string here directly or we can set it up to read from env.
// Let's set it up to prefer env but user can hardcode if they insist.

const connectionString = process.env.DATABASE_URL ||'postgresql://neondb_owner:npg_yhXDxe48bzqO@ep-icy-mode-a15vp7d4-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
    connectionString,
    ssl: true, // Neon needs SSL
});

export default pool;
