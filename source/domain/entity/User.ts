import { v4 as uudi } from "uuid";

export default class User {

    readonly id: string;
    readonly password: string;

    constructor(readonly nick: string, password: string, id?: string) {
        if (!id) id = uudi();
        this.id = id;
        this.password = password;
    }

}
