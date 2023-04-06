import { v4 as uuid } from "uuid";

import User from "../../../domain/entity/User";
import UsersData from "../../../domain/entity/UsersData";
import DataRepository from "../../../domain/repository/DataRepository";
import RepositoryFactory from "../../../domain/repository/RepositoryFactory";
import Connection from "../../database/Connection";

interface RawUsersData {

    id: string;
    user1_id: string;
    user2_id: string;
    data: string;

}

export default class DataRepositoryDatabase implements DataRepository {

    constructor(protected connection: Connection, protected repositoryFactory: RepositoryFactory) {
    }

    protected async mount(rawUsersData: RawUsersData): Promise<UsersData> {
        const userRepository = this.repositoryFactory.createUserRepository()
        const user1 = await userRepository.findById(rawUsersData.user1_id);
        const user2 = await userRepository.findById(rawUsersData.user2_id);
        return new UsersData(user1, user2, rawUsersData.data, rawUsersData.id);
    }
    
    async save(usersData: UsersData): Promise<UsersData> {
        const id = usersData.id ?? uuid();
        if (!usersData.id) await this.connection.execute("insert into public.users_data (id, user1_id, user2_id, data) values ($1, $2, $3, $4)", [id, usersData.user1.id, usersData.user2.id, usersData.data]);
        else await this.connection.execute("update public.users_data set data = $1 where id = $2", [usersData.data, id]);
        return await this.get(usersData.user1, usersData.user2);
    }
    
    async get(user1: User, user2: User): Promise<UsersData> {
        const [rawUsersData] = await this.connection.execute("select id, user1_id, user2_id, data from public.users_data where user1_id = $1 and user2_id = $2", [user1.id, user2.id]);
        if (!rawUsersData) throw new Error(`UsersData not found for ${user1.nick} and ${user2.nick}`);
        return await this.mount(rawUsersData);
    }
    
    async getAll(): Promise<UsersData[]> {
        const rawUsersDatas = await this.connection.execute("select id, user1_id, user2_id, data from public.users_data");
        const usersDatas = [];
        for (const rawUsersData of rawUsersDatas)
            usersDatas.push(await this.mount(rawUsersData));
        return usersDatas;
    }

    async clean(): Promise<void> {
        await this.connection.execute("delete from public.users_data");
    }

}
