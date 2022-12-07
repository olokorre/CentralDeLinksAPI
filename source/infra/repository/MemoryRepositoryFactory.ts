import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import UserRepository from "../../domain/repository/UserRepository";
import UserRepositoryMemory from "./memory/UserRepositoryMemory";

export default class MemoryRepositoryFactory implements RepositoryFactory {
    
    readonly userRepository: UserRepositoryMemory;

    constructor() {
        this.userRepository = new UserRepositoryMemory();
    }

    createUserRepository(): UserRepository {
        return this.userRepository;
    }

}
