import LinkRepository from "./LinkRepository";
import UserRepository from "./UserRepository";

export default interface RepositoryFactory {

    createUserRepository(): UserRepository;
    createLinkRepository(): LinkRepository;

}
