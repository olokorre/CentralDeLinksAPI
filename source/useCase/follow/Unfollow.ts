import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import UnfollowInput from "./UnfollowInput";

export default class Unfollow {

    constructor(readonly repositoryFactory: RepositoryFactory) {
    }

    async execute(input: UnfollowInput): Promise<void> {
        const userRepository = this.repositoryFactory.createUserRepository();
        const followRepository = this.repositoryFactory.createFollowRepository();
        const followee = await userRepository.findByNick(input.nick);
        await followRepository.unfollow(input.user.id, followee.id);
    }

}
