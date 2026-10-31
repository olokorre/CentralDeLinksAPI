import DataRepository from "../../domain/repository/DataRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import UserRepository from "../../domain/repository/UserRepository";
import GetSharedDataOutput from "./GetSharedDataOutput";
import GetSharedDataInput from "./GetSharedDataInput";

export default class GetSharedData {

    protected userRepository: UserRepository;
    protected dataRepository: DataRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.userRepository = repositoryFactory.createUserRepository();
        this.dataRepository = repositoryFactory.createDataRepository();
    }

    async execute(input: GetSharedDataInput): Promise<GetSharedDataOutput> {
        const otherUser = await this.userRepository.findById(input.userId);
        const usersData = await this.dataRepository.get(input.user, otherUser);
        return {
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
        }
    }

}
