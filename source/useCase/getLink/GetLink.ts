import LinkRepository from "../../domain/repository/LinkRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import GetLinkInput from "./GetLinkInput";
import GetLinkOutput from "./GetLinkOutput";

export default class GetLink {

    private linkRepository: LinkRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.linkRepository = repositoryFactory.createLinkRepository();
    }

    async execute(input: GetLinkInput): Promise<GetLinkOutput> {
        const link = await this.linkRepository.findById(input.linkId);
        if (link.userId !== input.user.id)
            throw new Error("Link not found");
        return {
            id: link.id,
            description: link.description,
            url: link.url
        }
    }

}
