import User from "../entity/User";

export default interface UserRepository {

    create(user: User): Promise<User>;
    findByNick(nick: string): Promise<User>;
    getAll(): Promise<User[]>;
    findById(userId: string): Promise<User>;
    clear(): Promise<void>;
    chageUserPassword(user: User, newPassword: string): Promise<void>;
    search(nick: string): Promise<User[]>;

}
