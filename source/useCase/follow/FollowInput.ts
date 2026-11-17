import User from "../../domain/entity/User";

export default interface FollowInput {

    user: User;
    nick: string;

}
