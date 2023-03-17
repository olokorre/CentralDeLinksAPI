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
    repositoryFactory = new DatabaseRepositoryFactory(connection);
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

afterEach(async function () {
    await connection.close();
});
