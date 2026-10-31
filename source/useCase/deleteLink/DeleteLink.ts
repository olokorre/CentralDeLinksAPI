import LinkRepository from "../../domain/repository/LinkRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import ForbiddenError from "../../domain/error/ForbiddenError";
import DeleteLinkInput from "./DeleteLinkInput";

export default class DeleteLink {

    readonly linkRepository: LinkRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.linkRepository = repositoryFactory.createLinkRepository();
    }

    async execute(input: DeleteLinkInput): Promise<void> {
        const link = await this.linkRepository.findById(input.linkId);
        if (link.userId !== input.user.id) throw new ForbiddenError("You do not own this link");
        await this.linkRepository.delete(link);
    }

}
