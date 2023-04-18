import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import ChangePassword from "../../useCase/changePassword/ChangePassword";
import ChangePasswordInput from "../../useCase/changePassword/ChangePasswordInput";
import CreateUser from "../../useCase/createUser/CreateUser";
import CreateUserInput from "../../useCase/createUser/CreateUserInput";
import CreateUserOutput from "../../useCase/createUser/CreateUserOutput";
import LoginUser from "../../useCase/loginUser/LoginUser";
import LoginUserInput from "../../useCase/loginUser/LoginUserInput";
import LoginUserOutput from "../../useCase/loginUser/LoginUserOutput";

export default class UserController {

    constructor(protected repositoryFactory: RepositoryFactory) {
    }

    async createUser(input: CreateUserInput): Promise<CreateUserOutput> {
        const createUser = new CreateUser(this.repositoryFactory);
        return await createUser.execute(input);
    }

    async login(input: LoginUserInput): Promise<LoginUserOutput> {
        const loginUser = new LoginUser(this.repositoryFactory);
        return await loginUser.execute(input);
    }

    async changePassword(input: ChangePasswordInput): Promise<object> {
        const changePassword = new ChangePassword(this.repositoryFactory);
        await changePassword.execute(input);
        return {
            "message": "Password changed"
        }
    }

}
