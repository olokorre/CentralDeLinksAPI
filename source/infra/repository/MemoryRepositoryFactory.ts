import DataRepository from "../../domain/repository/DataRepository";
import LinkRepository from "../../domain/repository/LinkRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import UserRepository from "../../domain/repository/UserRepository";
import DataRepositoryMemoty from "./memory/DataRepositoryMemoty";
import LinkRepositoryMemory from "./memory/LinkRepositoryMemory";
import UserRepositoryMemory from "./memory/UserRepositoryMemory";

export default class MemoryRepositoryFactory implements RepositoryFactory {
    
    readonly userRepository: UserRepositoryMemory;
    readonly linkRepository: LinkRepository;
    readonly dataRepository: DataRepository;

    constructor() {
        this.userRepository = new UserRepositoryMemory();
        this.linkRepository = new LinkRepositoryMemory();
        this.dataRepository = new DataRepositoryMemoty();
    }
    
    createUserRepository(): UserRepository {
        return this.userRepository;
    }
    
    createLinkRepository(): LinkRepository {
        return this.linkRepository;
    }

    createDataRepository(): DataRepository {
        return this.dataRepository;
    }

}
