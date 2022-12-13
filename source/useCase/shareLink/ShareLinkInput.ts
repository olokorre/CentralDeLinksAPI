import User from "../../domain/entity/User";

export default interface ShareLinkInput {

    user: User;
    linkId: string;
    userIdToShareLink: string;

}
