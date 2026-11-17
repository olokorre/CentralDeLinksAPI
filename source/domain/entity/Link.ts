import { v4 as uuid_v4, validate } from 'uuid';
import { URL } from 'url';
import ValidationError from "../error/ValidationError";

export default class Link {

    readonly id: string;
    readonly url: string;
    readonly userId: string;
    private _description: string;

    constructor(url: string, description: string, userId: string, id?: string, private _isPublic: boolean = false, readonly createdAt: Date = new Date()) {
        if (!id) id = uuid_v4();
        this.id = id;
        let parsedUrl: URL;
        try {
            parsedUrl = new URL(url);
        } catch {
            throw new ValidationError("Invalid URL");
        }
        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") throw new ValidationError("URL must be http or https");
        this.url = url;
        if (!validate(userId)) throw new ValidationError("Invalid UserID");
        this.userId = userId;
        if (description.length > 255) throw new ValidationError("Description too long");
        this._description = description
    }

    get description() {
        return this._description;
    }

    get isPublic() {
        return this._isPublic;
    }

    changeDescription(description: string): void {
        if (description.length > 255) throw new ValidationError("Description too long");
        this._description = description;
    }

    changeIsPublic(isPublic: boolean): void {
        this._isPublic = isPublic;
    }

}
