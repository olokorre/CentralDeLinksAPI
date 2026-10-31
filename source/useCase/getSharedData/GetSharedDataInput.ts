import User from "../../domain/entity/User";

export default interface GetSharedDataInput {

    user: User;
    userId: string;

}
