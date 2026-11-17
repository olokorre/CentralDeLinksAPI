import { v4 as uuid } from "uuid";

export default class User {

    readonly id: string;
    readonly password: string;

    constructor(readonly nick: string, password: string, id?: string, readonly bio: string = "", readonly createdAt: Date = new Date()) {
        if (!id) id = uuid();
        this.id = id;
        this.password = password;
    }

}
