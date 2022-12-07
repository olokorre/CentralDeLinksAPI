import User from "../../domain/entity/User";

export default interface AddLinkInput {

    user: User;
    description: string;
    url: string;

}