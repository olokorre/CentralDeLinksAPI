import RepositoryFactory from "../../../domain/repository/RepositoryFactory";
import FeedController from "../../controller/FeedController";
import Http from "../Http";
import ModelRoutes from "./ModelRoutes";

export default class FeedRoutes implements ModelRoutes {

    protected feedController: FeedController;

    constructor(readonly http: Http, repositoryFactory: RepositoryFactory) {
        this.feedController = new FeedController(repositoryFactory);
    }

    init(): void {
        this.http.route("get", "/feed", true, async (params: any, body: any) => {
            return await this.feedController.getFeed(body);
        });
    }

}
