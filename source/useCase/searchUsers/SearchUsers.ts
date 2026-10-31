import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import UserRepository from "../../domain/repository/UserRepository";
import parsePagination from "../../domain/validation/parsePagination";
import SearchUsersInput from "./SearchUsersInput";
import SearchUsersOutput from "./SearchUsersOutput";

export default class SearchUsers {

    private userRepository: UserRepository;

    constructor(repositoryFacotry: RepositoryFactory) {
        this.userRepository = repositoryFacotry.createUserRepository();
    }

    async execute(input: SearchUsersInput): Promise<SearchUsersOutput[]> {
        const { page, limit } = parsePagination(input.page, input.limit);
        const users = await this.userRepository.search(input.nick, page, limit);
        const output = [];
        for (const user of users) output.push({
            nick: user.nick,
            id: user.id
        });
        return output;
    }

}
