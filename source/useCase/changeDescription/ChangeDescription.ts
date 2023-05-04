import LinkRepository from "../../domain/repository/LinkRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import ChangeDescriptionInput from "./ChangeDescriptionInput";

export default class ChangeDescription {

    private linkRepository: LinkRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.linkRepository = repositoryFactory.createLinkRepository();
    }

    async execute(input: ChangeDescriptionInput): Promise<void> {
        const link = await this.linkRepository.findById(input.linkId);
        link.changeDescription(input.description);
        await this.linkRepository.update(link);
    }

}
