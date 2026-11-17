import DataRepository from "../../domain/repository/DataRepository";
import FollowRepository from "../../domain/repository/FollowRepository";
import LinkRepository from "../../domain/repository/LinkRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import UserRepository from "../../domain/repository/UserRepository";
import Connection from "../database/Connection";
import DataRepositoryDatabase from "./database/DataRepositoryDatabase";
import FollowRepositoryDatabase from "./database/FollowRepositoryDatabase";
import LinkRepositoryDatabase from "./database/LinkRepositoryDatabase";
import UserRepositoryDatabase from "./database/UserRepositoryDatabase";

export default class DatabaseRepositoryFactory implements RepositoryFactory {

    readonly userRepository: UserRepository;
    readonly linkRepository: LinkRepository;
    readonly dataRepository: DataRepository;
    readonly followRepository: FollowRepository;

    constructor(connection: Connection) {
        this.userRepository = new UserRepositoryDatabase(connection);
        this.linkRepository = new LinkRepositoryDatabase(connection);
        this.dataRepository = new DataRepositoryDatabase(connection, this);
        this.followRepository = new FollowRepositoryDatabase(connection);
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
