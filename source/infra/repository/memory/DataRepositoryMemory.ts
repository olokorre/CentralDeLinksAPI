import { v4 as uuid } from "uuid";

import User from "../../../domain/entity/User";
import UsersData from "../../../domain/entity/UsersData";
import DataRepository from "../../../domain/repository/DataRepository";
import NotFoundError from "../../../domain/error/NotFoundError";

export default class DataRepositoryMemory implements DataRepository {

    protected usersDatas: UsersData[];

    constructor() {
        this.usersDatas = [];
    }

    async save(usersData: UsersData): Promise<UsersData> {
        if (!usersData.id) {
            const newUsersData = new UsersData(usersData.user1, usersData.user2, usersData.data, uuid());
            this.usersDatas.push(newUsersData);
            return newUsersData;
        }
        for (const localUsersData of this.usersDatas) {
            if (localUsersData.id !== usersData.id) continue;
            const index = this.usersDatas.indexOf(localUsersData);
            this.usersDatas[index] = usersData;
        }
        return usersData;
    }

    async get(user1: User, user2: User): Promise<UsersData> {
        for (const usersData of this.usersDatas) {
            if (user1.id === usersData.user1.id && user2.id === usersData.user2.id) return usersData;
            if (user1.id === usersData.user2.id && user2.id === usersData.user1.id) return usersData;
        }
        throw new NotFoundError(`UsersData not found for ${user1.nick} and ${user2.nick}`);
    }

    async getAll(): Promise<UsersData[]> {
        return this.usersDatas;
    }

    async getAllByUser(user: User): Promise<UsersData[]> {
        return this.usersDatas.filter(usersData => usersData.user1.id === user.id || usersData.user2.id === user.id);
    }

    async clean(): Promise<void> {
        const totalItens = this.usersDatas.length;
        for (let index = 0; index < totalItens; index++)
            this.usersDatas.pop();
    }

}
