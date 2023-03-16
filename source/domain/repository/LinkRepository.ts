import Link from "../entity/Link";

export default interface LinkRepository {

    save(link: Link): Promise<Link>;
    getAll(): Promise<Link[]>;
    delete(link: Link): Promise<void>;
    findById(linkId: string): Promise<Link>;
    clear(): Promise<void>;

}
