import User from "../source/domain/entity/User";
import UsersData from "../source/domain/entity/UsersData";
import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import NotFoundError from "../source/domain/error/NotFoundError";
import ValidationError from "../source/domain/error/ValidationError";
import ShareData from "../source/useCase/shareData/ShareData";

let repositoryFactory: RepositoryFactory;

beforeEach(function () {
    repositoryFactory = new MemoryRepositoryFactory();
});

test("Deve poder compartilhar um texto com outro usuário", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const dataRepository = repositoryFactory.createDataRepository();
    const user1 = await userRepository.create(new User("olokorre", "password"));
    const user2 = await userRepository.create(new User("nemo", "password"));
    dataRepository.save(new UsersData(user1, user2));
    const shareData = new ShareData(repositoryFactory);
    const data = `
        #!/bin/python
        
        name = input('Your name: ')
        print(f'Hello, {name}')
    `;
    await shareData.execute({
        user: user1,
        userIdToShareData: user2.id,
        data: data
    });
    const usersDatas = await dataRepository.getAll();
    const [usersData] = usersDatas;
    expect(usersDatas).toHaveLength(1);
    expect(usersData.data).toBe(data);
});

test("Deve criar um compartilhamento e compartilhar um texto com outro usuário", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const dataRepository = repositoryFactory.createDataRepository();
    const user1 = await userRepository.create(new User("olokorre", "password"));
    const user2 = await userRepository.create(new User("nemo", "password"));
    expect(await dataRepository.getAll()).toHaveLength(0);
    const shareData = new ShareData(repositoryFactory);
    const data = `
        #!/bin/python
        
        name = input('Your name: ')
        print(f'Hello, {name}')
    `;
    await shareData.execute({
        user: user1,
        userIdToShareData: user2.id,
        data: data
    });
    const usersDatas = await dataRepository.getAll();
    const [usersData] = usersDatas;
    expect(usersDatas).toHaveLength(1);
    expect(usersData.data).toBe(data);
});

test("Não deve compartilhar um texto para si mesmo", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const dataRepository = repositoryFactory.createDataRepository();
    const user1 = await userRepository.create(new User("olokorre", "password"));
    const shareData = new ShareData(repositoryFactory);
    await expect(shareData.execute({
        user: user1,
        userIdToShareData: user1.id,
        data: "Hello"
    })).rejects.toThrow(new ValidationError("You cannot share data with yourself"));
    expect(await dataRepository.getAll()).toHaveLength(0);
});

test("Não deve compartilhar um texto para um usuário que não existe", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const dataRepository = repositoryFactory.createDataRepository();
    const user1 = await userRepository.create(new User("olokorre", "password"));
    const shareData = new ShareData(repositoryFactory);
    await expect(shareData.execute({
        user: user1,
        userIdToShareData: "id-de-usuario-inexistente",
        data: "Hello"
    })).rejects.toThrow(new NotFoundError("User not found"));
    expect(await dataRepository.getAll()).toHaveLength(0);
});
