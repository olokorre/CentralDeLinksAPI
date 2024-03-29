import User from "../source/domain/entity/User";
import UsersData from "../source/domain/entity/UsersData";
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
    const dataRepository = repositoryFactory.createDataRepository();
    await userRepository.clear();
    await dataRepository.clean();
});

test("Deve armazenar dados compartilhados entre dois usuários", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const dataRepository = repositoryFactory.createDataRepository();
    const user1 = await userRepository.create(new User("olokorre", "password", "221fe93e-82bb-47e7-972d-f51c6dec8af9"));
    const user2 = await userRepository.create(new User("nemo", "password", "40a7b675-b499-4cab-8df4-5c89701a6112"));
    const data = `
        #!/bin/python
        
        name = input('Your name: ')
        print(f'Hello, {name}')
    `;
    const usersData = new UsersData(user1, user2, data);
    await dataRepository.save(usersData);
    const savedUsersData = await dataRepository.get(user1, user2);
    expect(savedUsersData.data).toBe(data);
});

test("Deve disparar um erro ao tentar pegar dados não compartilhados entre dois usuários", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const dataRepository = repositoryFactory.createDataRepository();
    const user1 = await userRepository.create(new User("olokorre", "password", "221fe93e-82bb-47e7-972d-f51c6dec8af9"));
    const user2 = await userRepository.create(new User("nemo", "password", "40a7b675-b499-4cab-8df4-5c89701a6112"));
    await expect(dataRepository.get(user1, user2)).rejects.toThrow(new Error("UsersData not found for olokorre and nemo"));
});

afterEach(async function () {
    await connection.close();
});
