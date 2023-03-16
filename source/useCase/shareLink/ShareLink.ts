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

    async execute(input: ShareLinkInput): Promise<void> {
        const userToShare = await this.userRepository.findById(input.userIdToShareLink);
        const link = await this.linkRepository.findById(input.linkId);
        const newLink = new Link(link.url, link.description, userToShare.id);
        await this.linkRepository.save(newLink);
    }

}
