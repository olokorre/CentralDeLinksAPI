import RepositoryFactory from "../../../domain/repository/RepositoryFactory";
import UserController from "../../controller/UserController";
import Http from "../Http";
import ModelRoutes from "./ModelRoutes";

export default class UserRoutes implements ModelRoutes {

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

        this.http.route("post", "/auth/me", true, async (params: any, body: any) => {
            return await this.userController.getUser(body);
        });

        this.http.route("post", "/user/search", true, async (params: any, body: any) => {
            return await this.userController.search(body);
        });
    }

}
