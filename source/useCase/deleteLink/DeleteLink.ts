import LinkRepository from "../../domain/repository/LinkRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import DeleteLinkInput from "./DeleteLinkInput";

export default class DeleteLink {

    readonly linkRepository: LinkRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.linkRepository = repositoryFactory.createLinkRepository();
    }

    execute(input: DeleteLinkInput): void {
        const links = this.linkRepository.findById(input.linkId);
        this.linkRepository.delete(links);
    }

}
