import Link from "../../domain/entity/Link";
import LinkRepository from "../../domain/repository/LinkRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import UserRepository from "../../domain/repository/UserRepository";
import ShareLinkInput from "./ShareLinkInput";

export default class userIdToShareLink {

    readonly userRepository: UserRepository;
    readonly linkRepository: LinkRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.userRepository = repositoryFactory.createUserRepository();
        this.linkRepository = repositoryFactory.createLinkRepository();
    }

    execute(input: ShareLinkInput): void {
        const userToShare = this.userRepository.findById(input.userIdToShareLink);
        const link = this.linkRepository.findById(input.linkId);
        const newLink = new Link(link.url, link.description, userToShare.id);
        this.linkRepository.save(newLink);
    }

}
