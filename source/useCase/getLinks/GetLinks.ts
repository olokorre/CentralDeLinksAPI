import LinkRepository from "../../domain/repository/LinkRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import GetLinksInput from "./GetLinksInput";
import GetLinksOutput from "./GetLinksOutput";

export default class GetLinks {

    protected linkRepository: LinkRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.linkRepository = repositoryFactory.createLinkRepository();
    }

    async execute(input: GetLinksInput): Promise<GetLinksOutput> {
        const links = await this.linkRepository.getAllByUser(input.user);
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
