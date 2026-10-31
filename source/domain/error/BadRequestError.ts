import HttpError from "./HttpError";

export default class BadRequestError extends HttpError {

    constructor(message: string) {
        super(400, message);
    }

}
