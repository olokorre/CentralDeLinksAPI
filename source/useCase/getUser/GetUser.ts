import GetOuserOutput from "./GetOuserOutput";
import GetUserInput from "./GetUserInput";

export default class GetUser {

    constructor() {
    }

    async execute(input: GetUserInput): Promise<GetOuserOutput> {
        return {
            nick: input.user.nick,
            id: input.user.id
        }
    }

}
