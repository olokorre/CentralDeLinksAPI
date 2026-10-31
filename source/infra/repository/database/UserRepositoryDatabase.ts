import User from "../../../domain/entity/User";
import UserRepository from "../../../domain/repository/UserRepository";
import NotFoundError from "../../../domain/error/NotFoundError";
import ValidationError from "../../../domain/error/ValidationError";
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
        if (exists.length === 1) throw new ValidationError("Nick already exists");
        await this.connection.execute("insert into public.user (id, nick, password) values ($1, $2, $3);", [user.id, user.nick, user.password]);
        return await this.findById(user.id);
    }

    async findByNick(nick: string): Promise<User> {
        const result = await this.connection.execute("select id, nick, password from public.user where nick = $1", [nick]);
        if (!result.length) throw new NotFoundError("User not found");
        const [userData] = result;
        return this.mount(userData);
    }

    async getAll(): Promise<User[]> {
        const dataUsers = await this.connection.execute("select id, nick, password from public.user");
        return dataUsers.map(dataUser => this.mount(dataUser));
    }

    async findById(userId: string): Promise<User> {
        const [dataUser] = await this.connection.execute("select id, nick, password from public.user where id = $1", [userId]);
        if (!dataUser) throw new NotFoundError("User not found");
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

    async search(nick: string, page?: number, limit?: number): Promise<User[]> {
        const pattern = `%${nick.replace(/[\\%_]/g, "\\$&")}%`;
        if (page === undefined || limit === undefined) {
            const dataUsers = await this.connection.execute("select id, nick, password from public.user where nick like $1 escape '\\' order by nick", [pattern]);
            return dataUsers.map(dataUser => this.mount(dataUser));
        }
        const offset = (page - 1) * limit;
        const dataUsers = await this.connection.execute("select id, nick, password from public.user where nick like $1 escape '\\' order by nick limit $2 offset $3", [pattern, limit, offset]);
        return dataUsers.map(dataUser => this.mount(dataUser));
    }

}
