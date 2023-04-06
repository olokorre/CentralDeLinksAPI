import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import CreateUser from "../source/useCase/createUser/CreateUser";
import LoginUser from "../source/useCase/loginUser/LoginUser";

const createUser = async function () {
    const createUser = new CreateUser(repositoryFactory);
    await createUser.execute({
        nick: "olokorre",
        password: "password"
    });
}

let repositoryFactory: RepositoryFactory;

beforeEach(function () {
    repositoryFactory = new MemoryRepositoryFactory();
});

test("Deve logar um usuário recem criado", async function () {
    await createUser();
    const loginUser = new LoginUser(repositoryFactory);
    const input = {
        nick: "olokorre",
        password: "password"
    }
    const output = await loginUser.execute(input);
    expect(output.accessToken).toBeTruthy();
});

test("Não deve permitir o logim de um usuário com senha incorreta", async function () {
    await createUser();
    const loginUser = new LoginUser(repositoryFactory);
    const input = {
        nick: "olokorre",
        password: "drowssap"
    }
    await expect(loginUser.execute(input)).rejects.toThrow(new Error("Invalid credentials"));
});
