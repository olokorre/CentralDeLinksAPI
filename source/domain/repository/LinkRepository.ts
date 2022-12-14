import Link from "../entity/Link";

export default interface LinkRepository {

    save(link: Link): Link;
    getAll(): Link[];
    delete(link: Link): void;
    findById(linkId: string): Link;

}
