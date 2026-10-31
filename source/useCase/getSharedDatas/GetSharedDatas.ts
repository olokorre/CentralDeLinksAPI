import DataRepository from "../../domain/repository/DataRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import GetSharedDatasInput from "./GetSharedDatasInput";
import GetSharedDatasOutput from "./GetSharedDatasOutput";

export default class GetSharedDatas {

    protected dataRepository: DataRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.dataRepository = repositoryFactory.createDataRepository();
    }

    async execute(input: GetSharedDatasInput): Promise<GetSharedDatasOutput> {
        const usersDatas = await this.dataRepository.getAllByUser(input.user);
        return usersDatas.map(usersData => ({
            id: usersData.id,
            user1: {
                id: usersData.user1.id,
                nick: usersData.user1.nick
            },
            user2: {
                id: usersData.user2.id,
                nick: usersData.user2.nick
            },
            data: usersData.data
        }));
    }

}
