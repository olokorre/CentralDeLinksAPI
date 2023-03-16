import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import AddLink from "../source/useCase/addLink/AddLink";
import CreateUser from "../source/useCase/createUser/CreateUser";

const createUser = async function () {
    const createUser = new CreateUser(repositoryFactory);
    await createUser.execute({
        nick: "olokorre",
        password: "password"
    });
}

let repositoryFactory: RepositoryFactory;

beforeEach(function () {
    repositoryFactory = new MemoryRepositoryFactory();
});

test("Deve um usuário deve logado deve adicionar um link", async function () {
    await createUser();
    const user = await repositoryFactory
        .createUserRepository()
        .findByNick('olokorre');
    const input = {
        user,
        url: 'https://music.youtube.com/',
        description: 'Youtube Music'
    }
    const addLink = new AddLink(repositoryFactory);
    const output = await addLink.execute(input);
    expect(output.url).toBe('https://music.youtube.com/');
});
