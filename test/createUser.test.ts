import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import CreateUser from "../source/useCase/createUser/CreateUser";
import ValidationError from "../source/domain/error/ValidationError";

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

test("Não deve criar um usuário com nick vazio", async function () {
    const createUser = new CreateUser(repositoryFactory);
    await expect(createUser.execute({nick: '   ', password: 'password'}))
        .rejects.toThrow(new ValidationError("Nick is required"));
    await expect(createUser.execute({nick: '', password: 'password'}))
        .rejects.toThrow(new ValidationError("Nick is required"));
});

test("Não deve criar um usuário com nick fora do tamanho permitido", async function () {
    const createUser = new CreateUser(repositoryFactory);
    await expect(createUser.execute({nick: 'ab', password: 'password'}))
        .rejects.toThrow(new ValidationError("Nick must be between 3 and 30 characters"));
    await expect(createUser.execute({nick: 'a'.repeat(31), password: 'password'}))
        .rejects.toThrow(new ValidationError("Nick must be between 3 and 30 characters"));
});

test("Não deve criar um usuário com nick contendo caracteres inválidos", async function () {
    const createUser = new CreateUser(repositoryFactory);
    await expect(createUser.execute({nick: 'nick invalido', password: 'password'}))
        .rejects.toThrow(new ValidationError("Nick must contain only letters, numbers, dot, hyphen and underscore"));
    await expect(createUser.execute({nick: 'nick!', password: 'password'}))
        .rejects.toThrow(new ValidationError("Nick must contain only letters, numbers, dot, hyphen and underscore"));
});

test("Deve criar um usuário com nick contendo caracteres válidos", async function () {
    const createUser = new CreateUser(repositoryFactory);
    const output = await createUser.execute({nick: 'olokorre_01.dev-2', password: 'password'});
    expect(output.accessToken).toBeTruthy();
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
