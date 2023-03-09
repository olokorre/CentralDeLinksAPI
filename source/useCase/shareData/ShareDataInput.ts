import User from "../../domain/entity/User";

export default interface ShareDataInput {

    user: User;
    userIdToShareData: string;
    data: string;

}
