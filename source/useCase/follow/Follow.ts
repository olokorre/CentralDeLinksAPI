import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import BadRequestError from "../../domain/error/BadRequestError";
import FollowInput from "./FollowInput";

export default class Follow {

    constructor(readonly repositoryFactory: RepositoryFactory) {
    }

    async execute(input: FollowInput): Promise<void> {
        const userRepository = this.repositoryFactory.createUserRepository();
        const followRepository = this.repositoryFactory.createFollowRepository();
        const followee = await userRepository.findByNick(input.nick);
        if (followee.id === input.user.id) throw new BadRequestError("Cannot follow yourself");
        await followRepository.follow(input.user.id, followee.id);
    }

}
