import { v4 as uuid } from "uuid";

import User from "../../../domain/entity/User";
import UsersData from "../../../domain/entity/UsersData";
import DataRepository from "../../../domain/repository/DataRepository";

export default class DataRepositoryMemoty implements DataRepository {

    protected usersDatas: UsersData[];

    constructor() {
        this.usersDatas = [];
    }
    
    save(usersData: UsersData): UsersData {
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
    
    get(user1: User, user2: User): UsersData {
        for (const usersData of this.usersDatas)
            if (user1.id === usersData.user1.id && user2.id === usersData.user2.id) return usersData;
        throw new Error(`UsersData not found for ${user1.nick} and ${user2.nick}`);
    }

    getAll(): UsersData[] {
        return this.usersDatas;
    }

}
