import { Pool } from 'pg';

const pool = new Pool({
    database: process.env.POSTGRES_DATABASE,
    host: 'localhost',
    password: process.env.POSTGRES_DATABASE_PASSWORD,
    port: 5432,
    user: process.env.POSTGRES_DATABASE_USERNAME
});

export default pool;