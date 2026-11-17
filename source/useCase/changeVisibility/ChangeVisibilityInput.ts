import User from "../../domain/entity/User";

export default interface ChangeVisibilityInput {

    user: User;
    linkId: string;
    isPublic: boolean;

}
