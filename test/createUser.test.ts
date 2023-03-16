import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import CreateUser from "../source/useCase/createUser/CreateUser";

let repositoryFactory: RepositoryFactory;

beforeEach(function () {
    repositoryFactory = new MemoryRepositoryFactory();
});

test("Deve criar um usuário", async function () {
    const createUser = new CreateUser(repositoryFactory);
    const input = {
        nick: 'olokorre',
        password: 'password'
    }
    const output = await createUser.execute(input);
    expect(output.accessToken).toBeTruthy();
});

test("Não deve criar um usuário com senha inferior a seis caracteres", async function () {
    const createUser = new CreateUser(repositoryFactory);
    const input = {
        nick: 'olokorre',
        password: 'senha'
    }
    await expect(createUser.execute(input)).rejects.toThrow(new Error("Invalid password"));
});

test("Deve verificar se há registros no repositório", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    expect(await userRepository.getAll()).toHaveLength(0);
    const createUser = new CreateUser(repositoryFactory);
    const input = {
        nick: 'olokorre',
        password: 'password'
    }
    await createUser.execute(input);
    expect(await userRepository.getAll()).toHaveLength(1);
});
