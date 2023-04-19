import RepositoryFactory from "../../../domain/repository/RepositoryFactory";
import DataController from "../../controller/DataController";
import Http from "../Http";
import ModelRoutes from "./ModelRoutes";

export default class DataRoutes implements ModelRoutes {

    protected dataController: DataController;

    constructor(readonly http: Http, repositoryFactory: RepositoryFactory) {
        this.dataController = new DataController(repositoryFactory);
    }
    
    init(): void {
        this.http.route("post", "/data/share", true, async (params: any, body: any) => {
            return this.dataController.shareData(body);
        });
    }

}
