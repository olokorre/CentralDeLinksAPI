import { hash, compare } from "bcrypt";

import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import UserRepository from "../../domain/repository/UserRepository";
import UnauthorizedError from "../../domain/error/UnauthorizedError";
import ValidationError from "../../domain/error/ValidationError";
import ChangePasswordInput from "./ChangePasswordInput";

export default class ChangePassword {

    protected userRepository: UserRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.userRepository = repositoryFactory.createUserRepository();
    }

    async execute(input: ChangePasswordInput): Promise<void> {
        if (input.newPassword !== input.rePassword) throw new ValidationError("The new passwords are not the same");
        if (input.newPassword.length < 6) throw new ValidationError("Invalid password");
        const isEqual = await compare(input.password, input.user.password);
        if (!isEqual) throw new UnauthorizedError("Invalid credentials");
        const encryptPassword = await hash(input.newPassword, 10);
        const newPasswordIsEqual = await compare(input.password, encryptPassword);
        if (newPasswordIsEqual) throw new ValidationError("Same password");
        await this.userRepository.chageUserPassword(input.user, encryptPassword);
    }

}
