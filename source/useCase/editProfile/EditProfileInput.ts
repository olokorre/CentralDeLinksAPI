import User from "../../domain/entity/User";

export default interface EditProfileInput {

    user: User;
    bio: string;

}
