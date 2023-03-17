import Link from "../../../domain/entity/Link";
import LinkRepository from "../../../domain/repository/LinkRepository";
import Connection from "../../database/Connection";

interface LinkData {

    id: string;
    description: string;
    url: string;
    user_id: string;

}

export default class LinkRepositoryDatabase implements LinkRepository {

    constructor(protected connection: Connection) {
    }

    protected mount(linkData: LinkData): Link {
        const {id, description, url, user_id} = linkData;
        return new Link(url, description, user_id, id);
    }
    
    async save(link: Link): Promise<Link> {
        const [exists] = await this.connection.execute("select 1 from public.link where url = $1 and user_id = $2", [link.url, link.userId]);
        if (exists) throw new Error("URL already exists");
        const [linkData] = await this.connection.execute("insert into public.link (id, description, url, user_id) values ($1, $2, $3, $4) returning id, description, url, user_id", [link.id, link.description, link.url, link.userId]);
        return this.mount(linkData);
    }
    
    async getAll(): Promise<Link[]> {
        const linksData = await this.connection.execute("select id, description, url, user_id from public.link");
        const links = [];
        for (const linkData of linksData)
            links.push(this.mount(linkData));
        return links;
    }
    
    async delete(link: Link): Promise<void> {
        await this.findById(link.id);
        await this.connection.execute("delete from public.link where id = $1", [link.id]);
    }
    
    async findById(linkId: string): Promise<Link> {
        const [linkData] = await this.connection.execute("select id, description, url, user_id from public.link where id = $1", [linkId]);
        if (!linkData) throw new Error("Link not found");
        return this.mount(linkData);
    }
    
    async clear(): Promise<void> {
        await this.connection.execute("delete from public.link");
    }

}
