import User from "../entity/User";
import UsersData from "../entity/UsersData";

export default interface DataRepository {

    save(usersData: UsersData): Promise<UsersData>;
    get(user1: User, user2: User): Promise<UsersData>;
    getAll(): Promise<UsersData[]>;
    clean(): Promise<void>;

}
