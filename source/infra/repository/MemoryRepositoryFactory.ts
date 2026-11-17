import DataRepository from "../../domain/repository/DataRepository";
import FollowRepository from "../../domain/repository/FollowRepository";
import LinkRepository from "../../domain/repository/LinkRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import UserRepository from "../../domain/repository/UserRepository";
import DataRepositoryMemory from "./memory/DataRepositoryMemory";
import FollowRepositoryMemory from "./memory/FollowRepositoryMemory";
import LinkRepositoryMemory from "./memory/LinkRepositoryMemory";
import UserRepositoryMemory from "./memory/UserRepositoryMemory";

export default class MemoryRepositoryFactory implements RepositoryFactory {
    
    readonly userRepository: UserRepository;
    readonly linkRepository: LinkRepository;
    readonly dataRepository: DataRepository;
    readonly followRepository: FollowRepository;

    constructor() {
        this.userRepository = new UserRepositoryMemory();
        this.linkRepository = new LinkRepositoryMemory();
        this.dataRepository = new DataRepositoryMemory();
        this.followRepository = new FollowRepositoryMemory();
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

    createFollowRepository(): FollowRepository {
        return this.followRepository;
    }

}
