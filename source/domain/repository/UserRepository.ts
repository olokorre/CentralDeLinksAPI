import User from "../entity/User";

export default interface UserRepository {

    create(user: User): User;
    findByNick(nick: string): User;
    getAll(): User[];
    findById(userId: string): User;

}
