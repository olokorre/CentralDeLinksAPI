import Link from "../../domain/entity/Link";
import LinkRepository from "../../domain/repository/LinkRepository";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import UserRepository from "../../domain/repository/UserRepository";
import ForbiddenError from "../../domain/error/ForbiddenError";
import ValidationError from "../../domain/error/ValidationError";
import ShareLinkInput from "./ShareLinkInput";

export default class ShareLink {

    readonly userRepository: UserRepository;
    readonly linkRepository: LinkRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.userRepository = repositoryFactory.createUserRepository();
        this.linkRepository = repositoryFactory.createLinkRepository();
    }

    async execute(input: ShareLinkInput): Promise<void> {
        const link = await this.linkRepository.findById(input.linkId);
        if (link.userId !== input.user.id) throw new ForbiddenError("You do not own this link");
        if (input.user.id === input.userIdToShareLink) throw new ValidationError("You cannot share a link with yourself");
        const userToShare = await this.userRepository.findById(input.userIdToShareLink);
        const newLink = new Link(link.url, link.description, userToShare.id);
        await this.linkRepository.save(newLink);
    }

}
