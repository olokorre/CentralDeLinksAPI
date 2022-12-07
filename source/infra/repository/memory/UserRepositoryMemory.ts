import User from "../../../domain/entity/User";
import UserRepository from "../../../domain/repository/UserRepository";

export default class UserRepositoryMemory implements UserRepository {

    private users: User[];

    constructor() {
        this.users = [];
    }

    findByNick(nick: string): User {
        const user = this.users.find(user => user.nick === nick);
        if (!user) throw new Error("User not foud");
        return user;
    }
    
    create(user: User): User {
        const exists = this.users.find(existentUser => existentUser.nick === user.nick);
        if (exists) throw new Error("Nick already exists");
        this.users.push(user);
        return user;
    }

    getAll(): User[] {
        return this.users;
    }

}
