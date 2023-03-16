import User from "../source/domain/entity/User";
import UsersData from "../source/domain/entity/UsersData";
import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";

let repositoryFactory: RepositoryFactory;

beforeEach(function () {
    repositoryFactory = new MemoryRepositoryFactory();
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
    dataRepository.save(usersData);
    const savedUsersData = dataRepository.get(user1, user2);
    expect(savedUsersData.data).toBe(data);
});

test("Deve disparar um erro ao tentar pegar dados não compartilhados entre dois usuários", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const dataRepository = repositoryFactory.createDataRepository();
    const user1 = await userRepository.create(new User("olokorre", "password", "221fe93e-82bb-47e7-972d-f51c6dec8af9"));
    const user2 = await userRepository.create(new User("nemo", "password", "40a7b675-b499-4cab-8df4-5c89701a6112"));
    expect(() => dataRepository.get(user1, user2)).toThrow(new Error("UsersData not found for olokorre and nemo"));
});
