import User from "../../domain/entity/User";

export default interface GetLinkInput {

    user: User;
    linkId: string;

}
