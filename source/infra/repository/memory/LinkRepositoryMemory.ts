import Link from "../../../domain/entity/Link";
import User from "../../../domain/entity/User";
import LinkRepository from "../../../domain/repository/LinkRepository";

export default class LinkRepositoryMemory implements LinkRepository {

    private links: Link[];

    constructor() {
        this.links = [];
    }
    
    async save(link: Link): Promise<Link> {
        const exists = this.links.find(localLink => localLink.url === link.url);
        if (exists && exists.userId === link.userId) throw new Error("URL already exists");
        this.links.push(link);
        return link;
    }

    async getAll(): Promise<Link[]> {
        return this.links;
    }

    async delete(link: Link): Promise<void> {
        const index = this.links.indexOf(link);
        if (index < 0) throw new Error("Link not found");
        this.links.splice(index, 1);
    }

    async findById(linkId: string): Promise<Link> {
        const link = this.links.find(localLink => localLink.id === linkId);
        if (!link) throw new Error("Link not found");
        return link;
    }

    async clear(): Promise<void> {
        const totalLinks = this.links.length;
        for (let index = 0; index < totalLinks; index++)
            this.links.pop();
    }

    async getAllByUser(user: User): Promise<Link[]> {
        const links = [];
        for (const link of this.links) {
            if (link.userId != user.id) continue;
            links.push(link);
        }
        return links;
    }

}
