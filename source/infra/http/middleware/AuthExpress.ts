import { verify } from "jsonwebtoken";
import Auth from "./Auth";
import { readFileSync } from "fs";
import RepositoryFactory from "../../../domain/repository/RepositoryFactory";
import UserRepository from "../../../domain/repository/UserRepository";
import User from "../../../domain/entity/User";

export default class ExpressAuth implements Auth {

    protected userRepository: UserRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.userRepository = repositoryFactory.createUserRepository();
    }

    async execute(request: any, response: any, next: any): Promise<any> {
        if (!request.headers || !request.headers['access-token']) {
            return response.status(403).json({
                error: 'Token is required'
            });
        }
        const token = request.headers['access-token'];
        const user = await this.authenticate(token);
        if (!user) {
            return response.status(401).json({
                error: 'Invalid token'
            });
        }
        request.body = request.body ?? {};
        request.body.user = user;
        return next();
    }

    async authenticate(token: string): Promise<User | undefined> {
        try {
            const publicKey = readFileSync('./public.key', 'utf8');
            const data = verify(token, publicKey, { algorithms: ["RS256"] }); // @ts-ignore
            return await this.userRepository.findById(data.userId);
        } catch (e) {
            return undefined;
        }
    }

}
