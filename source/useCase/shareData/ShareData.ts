import UsersData from "../../domain/entity/UsersData";
import User from "../../domain/entity/User";
import DataRepository from "../../domain/repository/DataRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import UserRepository from "../../domain/repository/UserRepository";
import NotFoundError from "../../domain/error/NotFoundError";
import ValidationError from "../../domain/error/ValidationError";
import ShareDataInput from "./ShareDataInput";

export default class ShareData {

    protected userRepository: UserRepository;
    protected dataRepository: DataRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.userRepository = repositoryFactory.createUserRepository();
        this.dataRepository = repositoryFactory.createDataRepository();
    }

    async execute(input: ShareDataInput): Promise<void> {
        if (input.user.id === input.userIdToShareData) throw new ValidationError("You cannot share data with yourself");
        const user2 = await this.userRepository.findById(input.userIdToShareData);
        let usersData: UsersData;
        try {
            usersData = await this.dataRepository.get(input.user, user2);
        } catch (error) {
            if (!(error instanceof NotFoundError)) throw error;
            usersData = new UsersData(input.user, user2);
        }
        usersData.update(input.data);
        await this.dataRepository.save(usersData);
    }

}
