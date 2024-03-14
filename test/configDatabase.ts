import { config } from "dotenv";

config();

const configDatabase = {
    user: process.env.USER ?? '',
    password: process.env.PASSWORD ?? '',
    database: process.env.DATABASE ?? '',
    host: process.env.HOST ?? '',
    port: process.env.PORT ?? ''
}

export default configDatabase;
