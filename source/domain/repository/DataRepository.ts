import User from "../entity/User";
import UsersData from "../entity/UsersData";

export default interface DataRepository {

    save(usersData: UsersData): UsersData;
    get(user1: User, user2: User): UsersData;
    getAll(): UsersData[];

}
