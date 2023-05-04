import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import CreateUser from "../source/useCase/createUser/CreateUser";
import GetUser from "../source/useCase/getUser/GetUser";

let repositoryFactory: RepositoryFactory;

beforeEach(async function () {
    repositoryFactory = new MemoryRepositoryFactory();
    const createUser = new CreateUser(repositoryFactory);
    await createUser.execute({
        nick: 'nick',
        password: 'password'
    });
});

test("deve pegar os dados de usuário", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const user = await userRepository.findByNick('nick');
    const getUser = new GetUser();
    const input = {
        user
    }
    const output = await getUser.execute(input);
    expect(output.nick).toBe('nick');
});
