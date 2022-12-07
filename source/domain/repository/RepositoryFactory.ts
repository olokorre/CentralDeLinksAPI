import UserRepository from "./UserRepository";

export default interface RepositoryFactory {

    createUserRepository(): UserRepository;

}
