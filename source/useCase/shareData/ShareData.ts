import UsersData from "../../domain/entity/UsersData";
import DataRepository from "../../domain/repository/DataRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import UserRepository from "../../domain/repository/UserRepository";
import ShareDataInput from "./ShareDataInput";

export default class ShareData {

    protected userRepository: UserRepository;
    protected dataRepository: DataRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.userRepository = repositoryFactory.createUserRepository();
        this.dataRepository = repositoryFactory.createDataRepository();
    }

    async execute(input: ShareDataInput): Promise<void> {
        const user2 = await this.userRepository.findById(input.userIdToShareData);
        let usersData: UsersData;
        try {
            usersData = await this.dataRepository.get(input.user, user2);
        } catch (e) {
            usersData = new UsersData(input.user, user2);
        }
        usersData.update(input.data);
        this.dataRepository.save(usersData);
    }

}
