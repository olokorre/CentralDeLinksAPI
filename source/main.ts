import { config } from "dotenv";

import PostgreSQLConnection from "./infra/database/PostgreSQLConnection";
import ExpressHttp from "./infra/http/ExpressHttp";
import Router from "./infra/http/Router";
import ExpressAuth from "./infra/http/middleware/AuthExpress";
import DatabaseRepositoryFactory from "./infra/repository/DatabaseRepositoryFactory";
import MemoryRepositoryFactory from "./infra/repository/MemoryRepositoryFactory";

config();

const connection = new PostgreSQLConnection({
    user: process.env.USER ?? '',
    password: process.env.PASSWORD ?? '',
    database: process.env.DATABASE ?? '',
    host: process.env.HOST ?? '',
    port: process.env.PORT ?? ''
});
const repositoryFactory = new DatabaseRepositoryFactory(connection);
const auth = new ExpressAuth(repositoryFactory);
const http = new ExpressHttp(auth);
const router = new Router(http, repositoryFactory);

router.init();
http.listen(5001);
console.log('Running...');
