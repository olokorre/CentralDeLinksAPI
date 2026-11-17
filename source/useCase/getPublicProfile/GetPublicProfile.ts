import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import GetPublicProfileInput from "./GetPublicProfileInput";
import GetPublicProfileOutput from "./GetPublicProfileOutput";

export default class GetPublicProfile {

    constructor(readonly repositoryFactory: RepositoryFactory) {
    }

    async execute(input: GetPublicProfileInput): Promise<GetPublicProfileOutput> {
        const userRepository = this.repositoryFactory.createUserRepository();
        const linkRepository = this.repositoryFactory.createLinkRepository();
        const followRepository = this.repositoryFactory.createFollowRepository();
        const user = await userRepository.findByNick(input.nick);
        const links = await linkRepository.getPublicLinksByUser(user);
        const [followers, following] = await Promise.all([
            followRepository.countFollowers(user.id),
            followRepository.countFollowing(user.id)
        ]);
        const isFollowing = input.viewerId ? await followRepository.isFollowing(input.viewerId, user.id) : undefined;
        return {
            nick: user.nick,
            bio: user.bio,
            createdAt: user.createdAt.toISOString(),
            links: links.map(link => ({
                id: link.id,
                description: link.description,
                url: link.url,
                createdAt: link.createdAt.toISOString()
            })),
            followers,
            following,
            ...(isFollowing !== undefined ? { isFollowing } : {})
        };
    }

}
