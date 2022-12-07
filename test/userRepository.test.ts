import User from "../source/domain/entity/User";
import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";

let repositoryFactory: RepositoryFactory;

beforeEach(function () {
    repositoryFactory = new MemoryRepositoryFactory();
});

test("Deve salvar um usuário", function () {
    const user = new User('olokorre', 'password');
    const userRepository = repositoryFactory.createUserRepository();
    const userSaved = userRepository.create(user);
    expect(userSaved.id).toBe(user.id);
});

test("Não deve criar dois usuários com o mesmo nick", function () {
    const user = new User('olokorre', 'password');
    const userRepository = repositoryFactory.createUserRepository();
    userRepository.create(user);
    expect(() => userRepository.create(user)).toThrow(new Error("Nick already exists"));
});
