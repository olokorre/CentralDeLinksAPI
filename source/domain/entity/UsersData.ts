import User from "./User";

export default class UsersData {

    protected __data: string;

    constructor(readonly user1: User, readonly user2: User, data: string = "", readonly id?: string) {
        this.__data = data;
    }

    get data(): string {
        return this.__data;
    }

    update(data: string): void {
        this.__data = data;
    }

}
