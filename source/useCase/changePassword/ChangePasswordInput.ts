import User from "../../domain/entity/User";

export default interface ChangePasswordInput {

    user: User;
    password: string;
    newPassword: string;
    rePassword: string;

}
