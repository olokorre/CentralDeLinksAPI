import User from "../../domain/entity/User";

export default interface UnfollowInput {

    user: User;
    nick: string;

}
