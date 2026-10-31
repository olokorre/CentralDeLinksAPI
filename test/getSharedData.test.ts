import User from "../source/domain/entity/User";
import UsersData from "../source/domain/entity/UsersData";
import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import NotFoundError from "../source/domain/error/NotFoundError";
import GetSharedDatas from "../source/useCase/getSharedDatas/GetSharedDatas";
import GetSharedData from "../source/useCase/getSharedData/GetSharedData";
import ShareData from "../source/useCase/shareData/ShareData";

let repositoryFactory: RepositoryFactory;

beforeEach(function () {
    repositoryFactory = new MemoryRepositoryFactory();
});

test("Deve listar os dados compartilhados com o usuário", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const dataRepository = repositoryFactory.createDataRepository();
    const user1 = await userRepository.create(new User("olokorre", "password"));
    const user2 = await userRepository.create(new User("nemo", "password"));
    const user3 = await userRepository.create(new User("batatajuj", "password"));
    dataRepository.save(new UsersData(user1, user2, "Ola nemo"));
    dataRepository.save(new UsersData(user1, user3, "Ola juj"));
    const getSharedDatas = new GetSharedDatas(repositoryFactory);
    const output = await getSharedDatas.execute({user: user2});
    expect(output).toHaveLength(1);
    expect(output[0].data).toBe("Ola nemo");
    expect(output[0].user1.id).toBe(user1.id);
    expect(output[0].user1.nick).toBe("olokorre");
    expect(output[0].user2.id).toBe(user2.id);
    expect(output[0].user2.nick).toBe("nemo");
});

test("Deve buscar o par de dados compartilhados com um usuário específico", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const dataRepository = repositoryFactory.createDataRepository();
    const user1 = await userRepository.create(new User("olokorre", "password"));
    const user2 = await userRepository.create(new User("nemo", "password"));
    dataRepository.save(new UsersData(user1, user2, "Ola nemo"));
    const getSharedData = new GetSharedData(repositoryFactory);
    const output = await getSharedData.execute({user: user1, userId: user2.id});
    expect(output.data).toBe("Ola nemo");
});

test("Deve buscar o par de dados compartilhados independente da ordem", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const dataRepository = repositoryFactory.createDataRepository();
    const user1 = await userRepository.create(new User("olokorre", "password"));
    const user2 = await userRepository.create(new User("nemo", "password"));
    dataRepository.save(new UsersData(user1, user2, "Ola nemo"));
    const getSharedData = new GetSharedData(repositoryFactory);
    const output = await getSharedData.execute({user: user2, userId: user1.id});
    expect(output.data).toBe("Ola nemo");
});

test("Não deve buscar dados compartilhados com um usuário que não existe", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const user1 = await userRepository.create(new User("olokorre", "password"));
    const getSharedData = new GetSharedData(repositoryFactory);
    await expect(getSharedData.execute({user: user1, userId: "id-inexistente"}))
        .rejects.toThrow(new NotFoundError("User not found"));
});

test("Não deve buscar dados que não foram compartilhados", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const user1 = await userRepository.create(new User("olokorre", "password"));
    const user2 = await userRepository.create(new User("nemo", "password"));
    const getSharedData = new GetSharedData(repositoryFactory);
    await expect(getSharedData.execute({user: user1, userId: user2.id}))
        .rejects.toThrow(new NotFoundError(`UsersData not found for ${user1.nick} and ${user2.nick}`));
});

test("Deve listar os dados compartilhados depois de compartilhar", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const user1 = await userRepository.create(new User("olokorre", "password"));
    const user2 = await userRepository.create(new User("nemo", "password"));
    const shareData = new ShareData(repositoryFactory);
    await shareData.execute({user: user1, userIdToShareData: user2.id, data: "Ola nemo"});
    const getSharedDatas = new GetSharedDatas(repositoryFactory);
    const outputForRecipient = await getSharedDatas.execute({user: user2});
    const outputForSharer = await getSharedDatas.execute({user: user1});
    expect(outputForRecipient).toHaveLength(1);
    expect(outputForRecipient[0].data).toBe("Ola nemo");
    expect(outputForSharer).toHaveLength(1);
});
