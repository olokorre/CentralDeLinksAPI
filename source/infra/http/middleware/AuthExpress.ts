import { verify } from "jsonwebtoken";
import Auth from "./Auth";
import { readFileSync } from "fs";
import RepositoryFactory from "../../../domain/repository/RepositoryFactory";
import UserRepository from "../../../domain/repository/UserRepository";

export default class ExpressAuth implements Auth {

    protected userRepository: UserRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.userRepository = repositoryFactory.createUserRepository();
    }
    
    async execute(request: any, response: any, next: any): Promise<any> {
        if (!request.headers || !request.headers['access-token']) {
            return response.status(403).json({
                message: 'Token is required'
            });
        }
        const token = request.headers['access-token'];
        try {
            const publicKey = readFileSync('./public.key', 'utf8');
            const data = verify(token, publicKey, { algorithms: ["RS256"] }); // @ts-ignore
            const user = await this.userRepository.findById(data.userId);
            request.body.user = user;
            return next();
        } catch (e) {
            return response.status(401).json({
                message: 'Invalid token'
            });
        }
    }

}
