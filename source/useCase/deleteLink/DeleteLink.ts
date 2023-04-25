import LinkRepository from "../../domain/repository/LinkRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import DeleteLinkInput from "./DeleteLinkInput";

export default class DeleteLink {

    readonly linkRepository: LinkRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.linkRepository = repositoryFactory.createLinkRepository();
    }

    async execute(input: DeleteLinkInput): Promise<void> {
        const links = await this.linkRepository.findById(input.linkId);
        await this.linkRepository.delete(links);
    }

}
