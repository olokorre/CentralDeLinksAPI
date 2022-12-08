import Link from "../../../domain/entity/Link";
import LinkRepository from "../../../domain/repository/LinkRepository";

export default class LinkRepositoryMemory implements LinkRepository {

    private links: Link[];

    constructor() {
        this.links = [];
    }
    
    save(link: Link): Link {
        const exists = this.links.find(localLink => localLink.url === link.url);
        if (exists) throw new Error("URL already exists");
        this.links.push(link);
        return link;
    }

    getAll(): Link[] {
        return this.links;
    }

    delete(link: Link): void {
        const index = this.links.indexOf(link);
        if (index < 0) throw new Error("Link not found");
        this.links.splice(index, 1);
    }

}
