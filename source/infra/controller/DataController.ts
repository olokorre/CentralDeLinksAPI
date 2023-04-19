import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import ShareData from "../../useCase/shareData/ShareData";
import ShareDataInput from "../../useCase/shareData/ShareDataInput";

export default class DataController {

    constructor(readonly repositoryFactory: RepositoryFactory) {
    }

    async shareData(input: ShareDataInput): Promise<object> {
        const shareData = new ShareData(this.repositoryFactory);
        await shareData.execute(input);
        return {
            message: "ok"
        }
    }

}
