import { config } from "dotenv";

config();

const configDatabase = {
    user: process.env.DB_USER ?? '',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DATABASE ?? '',
    host: process.env.DB_HOST ?? '',
    port: process.env.DB_PORT ?? ''
}

export default configDatabase;
