import User from "../../domain/entity/User";

export default interface GetLinksInput {

    user: User;
    page?: number;
    limit?: number;

}
