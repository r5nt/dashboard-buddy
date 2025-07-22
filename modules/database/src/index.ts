export const postgresOptions = {
    database: process.env.POSTGRES_DATABASE,
    host: 'localhost',
    password: process.env.POSTGRES_DATABASE_PASSWORD,
    port: 5432,
    user: process.env.POSTGRES_DATABASE_USERNAME
};