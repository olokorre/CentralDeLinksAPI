import User from "../source/domain/entity/User";
import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import ValidationError from "../source/domain/error/ValidationError";
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

test("Deve paginar a busca de usuários", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    await userRepository.create(new User('usuario1', '123'));
    await userRepository.create(new User('usuario2', '123'));
    await userRepository.create(new User('usuario3', '123'));
    const searchUser = new SearchUsers(repositoryFactory);
    const firstPage = await searchUser.execute({nick: 'usuario', page: 1, limit: 2});
    const secondPage = await searchUser.execute({nick: 'usuario', page: 2, limit: 2});
    expect(firstPage).toHaveLength(2);
    expect(secondPage).toHaveLength(1);
    expect(firstPage.map(user => user.nick)).toEqual(['usuario1', 'usuario2']);
    expect(secondPage.map(user => user.nick)).toEqual(['usuario3']);
});

test("Deve limitar o limite máximo da busca de usuários", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    await userRepository.create(new User('usuario1', '123'));
    await userRepository.create(new User('usuario2', '123'));
    await userRepository.create(new User('usuario3', '123'));
    const searchUser = new SearchUsers(repositoryFactory);
    const output = await searchUser.execute({nick: 'usuario', limit: 500});
    expect(output).toHaveLength(3);
});

test("Não deve paginar com página inválida", async function () {
    const searchUser = new SearchUsers(repositoryFactory);
    await expect(searchUser.execute({nick: 'usuario', page: 0})).rejects.toThrow(new ValidationError("Invalid page"));
    await expect(searchUser.execute({nick: 'usuario', limit: 0})).rejects.toThrow(new ValidationError("Invalid limit"));
});
