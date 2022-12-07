import LinkRepository from "../../domain/repository/LinkRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import UserRepository from "../../domain/repository/UserRepository";
import LinkRepositoryMemory from "./memory/LinkRepositoryMemory";
import UserRepositoryMemory from "./memory/UserRepositoryMemory";

export default class MemoryRepositoryFactory implements RepositoryFactory {
    
    readonly userRepository: UserRepositoryMemory;
    readonly linkRepository: LinkRepository;

    constructor() {
        this.userRepository = new UserRepositoryMemory();
        this.linkRepository = new LinkRepositoryMemory();
    }
    
    createUserRepository(): UserRepository {
        return this.userRepository;
    }
    
    createLinkRepository(): LinkRepository {
        return this.linkRepository;
    }
}
