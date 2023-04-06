import User from "../../../domain/entity/User";
import UserRepository from "../../../domain/repository/UserRepository";
import Connection from "../../database/Connection";

interface DataUser {
    
    id: string;
    nick: string;
    password: string;

}

export default class UserRepositoryDatabase implements UserRepository {

    constructor(protected connection: Connection) {
    }

    async create(user: User): Promise<User> {
        const exists = await this.connection.execute("select id, nick, password from public.user where nick = $1", [user.nick]);
        if (exists.length === 1) throw new Error("Nick already exists");
        await this.connection.execute("insert into public.user (id, nick, password) values ($1, $2, $3);", [user.id, user.nick, user.password]);
        return await this.findById(user.id);
    }
    
    async findByNick(nick: string): Promise<User> {
        const [userData] = await this.connection.execute("select id, nick, password from public.user where nick = $1", [nick]);
        return this.mount(userData);
    }
    
    getAll(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
    
    async findById(userId: string): Promise<User> {
        const [dataUser] = await this.connection.execute("select id, nick, password from public.user where id = $1", [userId]);
        return this.mount(dataUser);
    }

    protected mount(dataUser: DataUser): User {
        const { id, nick, password } = dataUser;
        return new User(nick, password, id);
    }

    async clear(): Promise<void> {
        await this.connection.execute("delete from public.user");
    }

    async chageUserPassword(user: User, newPassword: string): Promise<void> {
        await this.connection.execute("update public.user set password = $1 where id = $2", [newPassword, user.id]);
    }

}
