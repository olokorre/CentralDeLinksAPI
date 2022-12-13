import Link from "../../domain/entity/Link";
import LinkRepository from "../../domain/repository/LinkRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import AddLinkInput from "./AddLinkInput";
import AddLinkOutput from "./AddLinkOutput";

export default class AddLink {

    private linkRepository: LinkRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.linkRepository = repositoryFactory.createLinkRepository()
    }

    execute(input: AddLinkInput): AddLinkOutput {
        const link = this.linkRepository.save(new Link(input.url, input.description, input.user.id));
        return {
            url: link.url,
            id: link.id
        }
    }

}
