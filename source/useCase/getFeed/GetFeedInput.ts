import User from "../../domain/entity/User";

export default interface GetFeedInput {

    user: User;
    page?: number;
    limit?: number;

}
