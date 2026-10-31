import { compare } from "bcrypt";
import { readFileSync } from "fs";
import { sign } from "jsonwebtoken";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import UserRepository from "../../domain/repository/UserRepository";
import NotFoundError from "../../domain/error/NotFoundError";
import UnauthorizedError from "../../domain/error/UnauthorizedError";
import LoginUserInput from "./LoginUserInput";
import LoginUserOutput from "./LoginUserOutput";

export default class LoginUser {

    readonly userRepository: UserRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.userRepository = repositoryFactory.createUserRepository();
    }

    async execute(input: LoginUserInput): Promise<LoginUserOutput> {
        let user;
        try {
            user = await this.userRepository.findByNick(input.nick);
        } catch (error) {
            if (error instanceof NotFoundError) throw new UnauthorizedError("Invalid credentials");
            throw error;
        }
        const isEqual = await compare(input.password, user.password);
        if (!isEqual) throw new UnauthorizedError("Invalid credentials");
        const privateKey = readFileSync('./private.key');
        const payload = {
            userId: user.id,
            userNick: user.nick
        }
        const accessToken = sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "2h"
        });
        return {
            accessToken
        }
    }

}
