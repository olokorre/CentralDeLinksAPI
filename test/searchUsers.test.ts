import User from "../source/domain/entity/User";
import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import SearchUsers from "../source/useCase/searchUsers/SearchUsers";

let repositoryFactory: RepositoryFactory;

beforeEach(function () {
    repositoryFactory = new MemoryRepositoryFactory();
});

test("Deve buscar usuários e os respectivos id no banco atraves de um campo de testo", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    await userRepository.create(new User('usuario1', '123'));
    await userRepository.create(new User('usuario2', '123'));
    await userRepository.create(new User('usuario3', '123'));
    await userRepository.create(new User('batatajuj', '123'));
    const searchUser = new SearchUsers(repositoryFactory);
    const output = await searchUser.execute({
        nick: 'bata'
    });
    expect(output).toHaveLength(1);
});

test("Deve buscar um usuário chamado 'batatajuj' no banco de dados", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    await userRepository.create(new User('usuario1', '123'));
    await userRepository.create(new User('usuario2', '123'));
    await userRepository.create(new User('usuario3', '123'));
    await userRepository.create(new User('batatajuj', '123'));
    const searchUser = new SearchUsers(repositoryFactory);
    const [output] = await searchUser.execute({
        nick: 'bata'
    });
    expect(output.nick).toBe('batatajuj');
});
