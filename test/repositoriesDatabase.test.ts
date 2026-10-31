import User from "../source/domain/entity/User";
import Link from "../source/domain/entity/Link";
import UsersData from "../source/domain/entity/UsersData";
import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import Connection from "../source/infra/database/Connection";
import PostgreSQLConnection from "../source/infra/database/PostgreSQLConnection";
import DatabaseRepositoryFactory from "../source/infra/repository/DatabaseRepositoryFactory";
import configDatabase from "./configDatabase";

let repositoryFactory: RepositoryFactory;
let connection: Connection;

beforeEach(async function () {
    connection = new PostgreSQLConnection(configDatabase);
    repositoryFactory = new DatabaseRepositoryFactory(connection);
    await repositoryFactory.createDataRepository().clean();
    await repositoryFactory.createLinkRepository().clear();
    await repositoryFactory.createUserRepository().clear();
});

afterEach(async function () {
    await connection.close();
});

test("Deve buscar todos os usuários no banco de dados", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    await userRepository.create(new User("usuario1", "123"));
    await userRepository.create(new User("usuario2", "123"));
    const users = await userRepository.getAll();
    expect(users).toHaveLength(2);
});

test("Deve paginar a busca de usuários no banco de dados", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    await userRepository.create(new User("usuario1", "123"));
    await userRepository.create(new User("usuario2", "123"));
    await userRepository.create(new User("usuario3", "123"));
    const firstPage = await userRepository.search("usuario", 1, 2);
    const secondPage = await userRepository.search("usuario", 2, 2);
    expect(firstPage).toHaveLength(2);
    expect(secondPage).toHaveLength(1);
    expect(secondPage[0].nick).toBe("usuario3");
});

test("Deve escapar os caracteres especiais na busca de usuários no banco de dados", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    await userRepository.create(new User("a_b", "123"));
    await userRepository.create(new User("axb", "123"));
    const users = await userRepository.search("a_b");
    expect(users).toHaveLength(1);
    expect(users[0].nick).toBe("a_b");
});

test("Deve paginar os links de um usuário no banco de dados", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const linkRepository = repositoryFactory.createLinkRepository();
    const user = await userRepository.create(new User("usuario_links", "123"));
    await linkRepository.save(new Link("https://www.youtube.com/", "Youtube", user.id));
    await linkRepository.save(new Link("https://github.com/", "Github", user.id));
    await linkRepository.save(new Link("https://gitlab.com/", "Gitlab", user.id));
    const firstPage = await linkRepository.getAllByUser(user, 1, 2);
    const secondPage = await linkRepository.getAllByUser(user, 2, 2);
    expect(firstPage).toHaveLength(2);
    expect(secondPage).toHaveLength(1);
});

test("Deve buscar os dados compartilhados independente da ordem no banco de dados", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const dataRepository = repositoryFactory.createDataRepository();
    const user1 = await userRepository.create(new User("olokorre", "password"));
    const user2 = await userRepository.create(new User("nemo", "password"));
    await dataRepository.save(new UsersData(user1, user2, "Ola nemo"));
    const shared = await dataRepository.get(user2, user1);
    expect(shared.data).toBe("Ola nemo");
});

test("Deve listar os dados compartilhados de um usuário no banco de dados", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const dataRepository = repositoryFactory.createDataRepository();
    const user1 = await userRepository.create(new User("olokorre", "password"));
    const user2 = await userRepository.create(new User("nemo", "password"));
    const user3 = await userRepository.create(new User("batatajuj", "password"));
    await dataRepository.save(new UsersData(user1, user2, "Ola nemo"));
    await dataRepository.save(new UsersData(user2, user3, "Ola juj"));
    const sharedWithUser2 = await dataRepository.getAllByUser(user2);
    expect(sharedWithUser2).toHaveLength(2);
    const sharedWithUser1 = await dataRepository.getAllByUser(user1);
    expect(sharedWithUser1).toHaveLength(1);
});
