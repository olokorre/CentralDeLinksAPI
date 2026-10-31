import HttpError from "./HttpError";

export default class ValidationError extends HttpError {

    constructor(message: string) {
        super(422, message);
    }

}
