import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import GetSharedData from "../../useCase/getSharedData/GetSharedData";
import GetSharedDataInput from "../../useCase/getSharedData/GetSharedDataInput";
import GetSharedDataOutput from "../../useCase/getSharedData/GetSharedDataOutput";
import GetSharedDatas from "../../useCase/getSharedDatas/GetSharedDatas";
import GetSharedDatasInput from "../../useCase/getSharedDatas/GetSharedDatasInput";
import GetSharedDatasOutput from "../../useCase/getSharedDatas/GetSharedDatasOutput";
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

    async getShared(input: GetSharedDatasInput): Promise<GetSharedDatasOutput> {
        const getSharedDatas = new GetSharedDatas(this.repositoryFactory);
        return await getSharedDatas.execute(input);
    }

    async getSharedWithUser(input: GetSharedDataInput): Promise<GetSharedDataOutput> {
        const getSharedData = new GetSharedData(this.repositoryFactory);
        return await getSharedData.execute(input);
    }

}
