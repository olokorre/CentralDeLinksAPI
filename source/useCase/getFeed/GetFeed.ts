import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import parsePagination from "../../domain/validation/parsePagination";
import GetFeedInput from "./GetFeedInput";
import GetFeedOutput from "./GetFeedOutput";

export default class GetFeed {

    constructor(readonly repositoryFactory: RepositoryFactory) {
    }

    async execute(input: GetFeedInput): Promise<GetFeedOutput> {
        const { page, limit } = parsePagination(input.page, input.limit);
        const followRepository = this.repositoryFactory.createFollowRepository();
        const followingIds = await followRepository.getFollowingIds(input.user.id);
        if (followingIds.length === 0) return { links: [] };
        const linkRepository = this.repositoryFactory.createLinkRepository();
        const links = await linkRepository.getPublicLinksByUsers(followingIds, page, limit);
        const formatedLinks = [];
        for (const link of links) formatedLinks.push({
            id: link.id,
            description: link.description,
            url: link.url,
            isPublic: link.isPublic
        });
        return {
            links: formatedLinks
        }
    }

}
