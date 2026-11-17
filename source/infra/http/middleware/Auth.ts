import User from "../../../domain/entity/User";

export default interface Auth {

    execute(request: any, response: any, next: any): any;
    authenticate(token: string): Promise<User | undefined>;

}
