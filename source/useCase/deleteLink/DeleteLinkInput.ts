import User from "../../domain/entity/User";

export default interface DeleteLinkInput {

    user: User;
    linkId: string;

}
