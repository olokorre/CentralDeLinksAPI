import ExpressHttp from "./infra/http/ExpressHttp";
import Router from "./infra/http/Router";
import ExpressAuth from "./infra/http/middleware/AuthExpress";
import MemoryRepositoryFactory from "./infra/repository/MemoryRepositoryFactory";

const repositoryFactory = new MemoryRepositoryFactory();
const auth = new ExpressAuth(repositoryFactory);
const http = new ExpressHttp(auth);
const router = new Router(http, repositoryFactory);

router.init();
http.listen(5001);
console.log('Running...');
