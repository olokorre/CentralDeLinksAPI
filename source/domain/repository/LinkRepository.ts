import Link from "../entity/Link";

export default interface LinkRepository {

    save(link: Link): Link;

}
