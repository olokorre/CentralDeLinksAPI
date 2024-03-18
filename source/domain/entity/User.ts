import { v4 as uuid } from "uuid";
import Link from "./Link";

export default class User {

    readonly id: string;
    readonly password: string;
    protected $links: Link[];

    constructor(readonly nick: string, password: string, id?: string, links: Link[] = []) {
        if (!id) id = uuid();
        this.id = id;
        this.password = password;
        this.$links = links;
    }

    get totalLinks(): number {
        return this.$links.length;
    }

    get links(): IterableIterator<Link> {
        return this.$links.values();
    }

    store(link: Link): void {
        this.$links.push(link);
    }

    remove(link: Link): void {
        const index = this.$links.indexOf(link);
        if (index < 0) throw new Error("Link not found");
        this.$links.splice(index, 1);
    }

}
