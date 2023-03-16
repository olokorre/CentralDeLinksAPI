import DataRepository from "../../domain/repository/DataRepository";
import LinkRepository from "../../domain/repository/LinkRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import UserRepository from "../../domain/repository/UserRepository";
import Connection from "../database/Connection";
import UserRepositoryDatabase from "./database/UserRepositoryDatabase";
import DataRepositoryMemoty from "./memory/DataRepositoryMemoty";
import LinkRepositoryMemory from "./memory/LinkRepositoryMemory";

export default class DatabaseRepositoryFactory implements RepositoryFactory {

    readonly userRepository: UserRepository;
    readonly linkRepository: LinkRepository;
    readonly dataRepository: DataRepository;

    constructor(connection: Connection) {
        this.userRepository = new UserRepositoryDatabase(connection);
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
