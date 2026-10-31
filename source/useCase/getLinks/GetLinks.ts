import LinkRepository from "../../domain/repository/LinkRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import parsePagination from "../../domain/validation/parsePagination";
import GetLinksInput from "./GetLinksInput";
import GetLinksOutput from "./GetLinksOutput";

export default class GetLinks {

    protected linkRepository: LinkRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.linkRepository = repositoryFactory.createLinkRepository();
    }

    async execute(input: GetLinksInput): Promise<GetLinksOutput> {
        const { page, limit } = parsePagination(input.page, input.limit);
        const links = await this.linkRepository.getAllByUser(input.user, page, limit);
        const formatedLinks = [];
        for (const link of links) formatedLinks.push({
            id: link.id,
            description: link.description,
            url: link.url
        });
        return {
            links: formatedLinks
        }

    }

}
