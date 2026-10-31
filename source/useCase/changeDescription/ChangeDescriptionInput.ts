import User from "../../domain/entity/User";

export default interface ChangeDescriptionInput {

    user: User;
    linkId: string;
    description: string;

}
