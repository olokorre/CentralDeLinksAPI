import Link from "../../../domain/entity/Link";
import LinkRepository from "../../../domain/repository/LinkRepository";

export default class LinkRepositoryMemory implements LinkRepository {

    private links: Link[];

    constructor() {
        this.links = [];
    }
    
    save(link: Link): Link {
        this.links.push(link);
        return link;
    }

}
