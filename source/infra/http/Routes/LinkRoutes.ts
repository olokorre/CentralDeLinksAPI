import RepositoryFactory from "../../../domain/repository/RepositoryFactory";
import LinkController from "../../controller/LinkController";
import Http from "../Http";
import ModelRoutes from "./ModelRoutes";

export default class LinkRoutes implements ModelRoutes {

    protected linkController: LinkController;

    constructor(readonly http: Http, repositoryFactory: RepositoryFactory) {
        this.linkController = new LinkController(repositoryFactory);
    }

    init(): void {
        this.http.route("post", "/links/add", true, async (params: any, body: any) => {
            return await this.linkController.addLink(body);
        });

        this.http.route("get", "/links/get", true, async (params: any, body: any) => {
            return await this.linkController.getLinks(body);
        });

        this.http.route("delete", "/links/delete", true, async (params: any, body: any) => {
            return await this.linkController.deleteLink(body);
        });

        this.http.route("post", "/links/share", true, async (params: any, body: any) => {
            return await this.linkController.shareLink(body);
        });
    }

}
