import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import Http from "./Http";
import DataRoutes from "./Routes/DataRoutes";
import LinkRoutes from "./Routes/LinkRoutes";
import UserRoutes from "./Routes/UserRoutes";
export default class Router {

	protected userRoutes: UserRoutes;
	protected linkRoutes: LinkRoutes;
	protected dataRoutes: DataRoutes;

	constructor(readonly http: Http, readonly repositoryFactory: RepositoryFactory) {
		this.userRoutes = new UserRoutes(this.http, this.repositoryFactory);
		this.linkRoutes = new LinkRoutes(this.http, this.repositoryFactory);
		this.dataRoutes = new DataRoutes(this.http, this.repositoryFactory);
	}

	init() {
		this.http.route("get", "/", false, async (params: any, body: any) => {
			return {
				message: "welcome"
			}
		});
		this.userRoutes.init();
		this.linkRoutes.init();
		this.dataRoutes.init();
	}
}
