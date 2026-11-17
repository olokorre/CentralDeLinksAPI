import LinkRepository from "../../domain/repository/LinkRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import NotFoundError from "../../domain/error/NotFoundError";
import ValidationError from "../../domain/error/ValidationError";
import ChangeVisibilityInput from "./ChangeVisibilityInput";

export default class ChangeVisibility {

    private linkRepository: LinkRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.linkRepository = repositoryFactory.createLinkRepository();
    }

    async execute(input: ChangeVisibilityInput): Promise<void> {
        if (typeof input.isPublic !== "boolean") throw new ValidationError("Invalid isPublic");
        const link = await this.linkRepository.findById(input.linkId);
        if (link.userId !== input.user.id) throw new NotFoundError("Link not found");
        link.changeIsPublic(input.isPublic);
        await this.linkRepository.update(link);
    }

}
