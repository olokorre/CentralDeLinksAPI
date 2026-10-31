import User from "../source/domain/entity/User";
import UsersData from "../source/domain/entity/UsersData";
import DataRepositoryMemory from "../source/infra/repository/memory/DataRepositoryMemory";
import NotFoundError from "../source/domain/error/NotFoundError";

let dataRepository: DataRepositoryMemory;

beforeEach(function () {
    dataRepository = new DataRepositoryMemory();
});

test("Deve buscar os dados compartilhados independente da ordem dos usuários", async function () {
    const user1 = new User("olokorre", "password");
    const user2 = new User("nemo", "password");
    await dataRepository.save(new UsersData(user1, user2, "Ola nemo"));
    const shared = await dataRepository.get(user2, user1);
    expect(shared.data).toBe("Ola nemo");
});

test("Deve disparar um erro ao buscar dados não compartilhados", async function () {
    const user1 = new User("olokorre", "password");
    const user2 = new User("nemo", "password");
    await expect(dataRepository.get(user1, user2))
        .rejects.toThrow(new NotFoundError("UsersData not found for olokorre and nemo"));
});

test("Deve listar os dados compartilhados de um usuário", async function () {
    const user1 = new User("olokorre", "password");
    const user2 = new User("nemo", "password");
    const user3 = new User("batatajuj", "password");
    await dataRepository.save(new UsersData(user1, user2, "Ola nemo"));
    await dataRepository.save(new UsersData(user2, user3, "Ola juj"));
    await dataRepository.save(new UsersData(user3, user1, "Ola korre"));
    expect(await dataRepository.getAllByUser(user1)).toHaveLength(2);
    expect(await dataRepository.getAllByUser(user2)).toHaveLength(2);
    expect(await dataRepository.getAllByUser(user3)).toHaveLength(2);
});
