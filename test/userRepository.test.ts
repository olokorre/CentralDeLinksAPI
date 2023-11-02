import User from "../source/domain/entity/User";
import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import Connection from "../source/infra/database/Connection";
import PostgreSQLConnection from "../source/infra/database/PostgreSQLConnection";
import DatabaseRepositoryFactory from "../source/infra/repository/DatabaseRepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import configDatabase from "./configDatabase";

let repositoryFactory: RepositoryFactory;
let connection: Connection;

beforeEach(async function () {
    connection = new PostgreSQLConnection(configDatabase);
    repositoryFactory = new MemoryRepositoryFactory();
    const userRepository = repositoryFactory.createUserRepository();
    await userRepository.clear();
});

test("Deve salvar um usuário", async function () {
    const user = new User('olokorre', 'password');
    const userRepository = repositoryFactory.createUserRepository();
    const userSaved = await userRepository.create(user);
    expect(userSaved.id).toBe(user.id);
});

test("Não deve criar dois usuários com o mesmo nick", async function () {
    const user = new User('olokorre', 'password');
    const userRepository = repositoryFactory.createUserRepository();
    await userRepository.create(user);
    await expect(userRepository.create(user)).rejects.toThrow(new Error("Nick already exists"));
});

test("Deve alterar a senha de um usuário no repositório", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    let user = new User('olokorre', 'password');
    await userRepository.create(user);
    await userRepository.chageUserPassword(user, 'new_password_strong');
    user = await userRepository.findByNick('olokorre');
    expect(user.password).toBe('new_password_strong');
    expect(user.password).not.toBe('password');
});

test("Deve buscar vários usuários com nick similar no banco de dados", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    await userRepository.create(new User('usuario1', '123'));
    await userRepository.create(new User('usuario2', '123'));
    await userRepository.create(new User('usuario3', '123'));
    await userRepository.create(new User('batatajuj', '123'));
    const users = await userRepository.search('usua');
    expect(users).toHaveLength(3);
});

afterEach(async function () {
    await connection.close();
});
