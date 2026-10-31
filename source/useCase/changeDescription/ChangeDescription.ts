import LinkRepository from "../../domain/repository/LinkRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import ForbiddenError from "../../domain/error/ForbiddenError";
import ChangeDescriptionInput from "./ChangeDescriptionInput";

export default class ChangeDescription {

    private linkRepository: LinkRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.linkRepository = repositoryFactory.createLinkRepository();
    }

    async execute(input: ChangeDescriptionInput): Promise<void> {
        const link = await this.linkRepository.findById(input.linkId);
        if (link.userId !== input.user.id) throw new ForbiddenError("You do not own this link");
        link.changeDescription(input.description);
        await this.linkRepository.update(link);
    }

}
