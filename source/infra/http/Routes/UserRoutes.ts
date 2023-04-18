import RepositoryFactory from "../../../domain/repository/RepositoryFactory";
import UserController from "../../controller/UserController";
import Http from "../Http";

export default class UserRoutes {

    protected userController: UserController;

    constructor(readonly http: Http, repositoryFactory: RepositoryFactory) {
        this.userController = new UserController(repositoryFactory);
    }

    init(): void {
        this.http.route("post", "/auth/register", false, async (params: any, body: any) => {
			return await this.userController.createUser(body);
		});

        this.http.route("post", "/auth/login", false, async (params: any, body: any) => {
            return this.userController.login(body);
        });

        this.http.route("post", "/auth/change_password", true, async (params: any, body: any) => {
            return await this.userController.changePassword(body);
        });
    }

}
