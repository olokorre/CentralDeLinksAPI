import RepositoryFactory from "../../../domain/repository/RepositoryFactory";
import Http from "../Http";
import ModelRoutes from "./ModelRoutes";
import ProfileController from "../../controller/ProfileController";
import AuthExpress from "../middleware/AuthExpress";

export default class ProfileRoutes implements ModelRoutes {

    protected profileController: ProfileController;

    constructor(readonly http: Http, repositoryFactory: RepositoryFactory) {
        this.profileController = new ProfileController(repositoryFactory, new AuthExpress(repositoryFactory));
    }

    init(): void {
        this.http.route("get", "/profile/:nick", false, async (params: any, body: any, headers: any) => {
            return await this.profileController.getPublicProfile(params, headers);
        });

        this.http.route("patch", "/profile", true, async (params: any, body: any) => {
            return await this.profileController.editProfile(body);
        });

        this.http.route("post", "/profile/:nick/follow", true, async (params: any, body: any) => {
            await this.profileController.follow(params, body.user);
        });

        this.http.route("delete", "/profile/:nick/follow", true, async (params: any, body: any) => {
            await this.profileController.unfollow(params, body.user);
        });
    }

}
