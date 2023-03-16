import User from "../../../domain/entity/User";
import UserRepository from "../../../domain/repository/UserRepository";

export default class UserRepositoryMemory implements UserRepository {

    private users: User[];

    constructor() {
        this.users = [];
    }

    async findByNick(nick: string): Promise<User> {
        const user = this.users.find(user => user.nick === nick);
        if (!user) throw new Error("User not foud");
        return user;
    }
    
    async create(user: User): Promise<User> {
        const exists = this.users.find(existentUser => existentUser.nick === user.nick);
        if (exists) throw new Error("Nick already exists");
        this.users.push(user);
        return user;
    }

    async getAll(): Promise<User[]> {
        return this.users;
    }

    async findById(userId: string): Promise<User> {
        const user = this.users.find(user => user.id === userId);
        if (!user) throw new Error("User not foud");
        return user;
    }

    async clear(): Promise<void> {
        const totalUsers = this.users.length;
        for (let i = 0; i < totalUsers; i++)
            this.users.pop();
    }

}
