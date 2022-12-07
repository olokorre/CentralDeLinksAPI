import { v4 as uuid_v4, validate } from 'uuid';
import { URL } from 'url';

export default class Link {

    readonly id: string;
    readonly url: string;
    readonly userId: string;

    constructor(url: string, readonly description: string, userId: string, id?: string) {
        if (!id) id = uuid_v4();
        this.id = id;
        new URL(url);
        this.url = url;
        if (!validate(userId)) throw new Error("Invalid UserID");
        this.userId = userId;
    }

}
