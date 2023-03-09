import User from "../source/domain/entity/User";
import UsersData from "../source/domain/entity/UsersData";
import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import ShareData from "../source/useCase/shareData/ShareData";

let repositoryFactory: RepositoryFactory;

beforeEach(function () {
    repositoryFactory = new MemoryRepositoryFactory();
});

test("Deve poder compartilhar um texto com outro usuário", function () {
    const userRepository = repositoryFactory.createUserRepository();
    const dataRepository = repositoryFactory.createDataRepository();
    const user1 = userRepository.create(new User("olokorre", "password"));
    const user2 = userRepository.create(new User("nemo", "password"));
    dataRepository.save(new UsersData(user1, user2));
    const shareData = new ShareData(repositoryFactory);
    const data = `
        #!/bin/python
        
        name = input('Your name: ')
        print(f'Hello, {name}')
    `;
    shareData.execute({
        user: user1,
        userIdToShareData: user2.id,
        data: data
    });
    const usersDatas = dataRepository.getAll();
    const [usersData] = usersDatas;
    expect(usersDatas).toHaveLength(1);
    expect(usersData.data).toBe(data);
});

test("Deve criar um compartilhamento e compartilhar um texto com outro usuário", function () {
    const userRepository = repositoryFactory.createUserRepository();
    const dataRepository = repositoryFactory.createDataRepository();
    const user1 = userRepository.create(new User("olokorre", "password"));
    const user2 = userRepository.create(new User("nemo", "password"));
    expect(dataRepository.getAll()).toHaveLength(0);
    const shareData = new ShareData(repositoryFactory);
    const data = `
        #!/bin/python
        
        name = input('Your name: ')
        print(f'Hello, {name}')
    `;
    shareData.execute({
        user: user1,
        userIdToShareData: user2.id,
        data: data
    });
    const usersDatas = dataRepository.getAll();
    const [usersData] = usersDatas;
    expect(usersDatas).toHaveLength(1);
    expect(usersData.data).toBe(data);
});
