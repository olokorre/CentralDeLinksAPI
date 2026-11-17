import Link from "../../../domain/entity/Link";
import User from "../../../domain/entity/User";
import LinkRepository from "../../../domain/repository/LinkRepository";
import NotFoundError from "../../../domain/error/NotFoundError";
import ValidationError from "../../../domain/error/ValidationError";

export default class LinkRepositoryMemory implements LinkRepository {

    private links: Link[];

    constructor() {
        this.links = [];
    }

    async save(link: Link): Promise<Link> {
        const exists = this.links.find(localLink => localLink.url === link.url);
        if (exists && exists.userId === link.userId) throw new ValidationError("URL already exists");
        this.links.push(link);
        return link;
    }

    async getAll(): Promise<Link[]> {
        return this.links;
    }

    async delete(link: Link): Promise<void> {
        const index = this.links.indexOf(link);
        if (index < 0) throw new NotFoundError("Link not found");
        this.links.splice(index, 1);
    }

    async findById(linkId: string): Promise<Link> {
        const link = this.links.find(localLink => localLink.id === linkId);
        if (!link) throw new NotFoundError("Link not found");
        return link;
    }

    async clear(): Promise<void> {
        const totalLinks = this.links.length;
        for (let index = 0; index < totalLinks; index++)
            this.links.pop();
    }

    async getAllByUser(user: User, page?: number, limit?: number): Promise<Link[]> {
        const links = this.links.filter(link => link.userId === user.id);
        if (page === undefined || limit === undefined) return links;
        return links.slice((page - 1) * limit, page * limit);
    }

    async update(link: Link): Promise<Link> {
        await this.findById(link.id);
        const index = this.links.indexOf(link);
        this.links[index] = link;
        return link;
    }

    async getPublicLinksByUser(user: User): Promise<Link[]> {
        return this.links.filter(link => link.userId === user.id && link.isPublic);
    }

    async getPublicLinksByUsers(userIds: string[], page?: number, limit?: number): Promise<Link[]> {
        const ids = new Set(userIds);
        const links = this.links.filter(link => link.isPublic && ids.has(link.userId));
        links.sort((firstLink, secondLink) => secondLink.createdAt.getTime() - firstLink.createdAt.getTime());
        if (page === undefined || limit === undefined) return links;
        return links.slice((page - 1) * limit, page * limit);
    }

}
