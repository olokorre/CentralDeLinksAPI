import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { readFileSync } from "fs";
import User from "../../domain/entity/User";
import CreateUserInput from "./CreateUserInput";
import CreateUserOutput from "./CreateUserOutput";
import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import UserRepository from "../../domain/repository/UserRepository";

export default class CreateUser {

    readonly userRepository: UserRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.userRepository = repositoryFactory.createUserRepository();
    }

    async execute(input: CreateUserInput): Promise<CreateUserOutput> {
        if (input.password.length < 6) throw new Error("Invalid password");
        const encryptPassword = await hash(input.password, 10);
        const user = new User(input.nick, encryptPassword);
        await this.userRepository.create(user);
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
