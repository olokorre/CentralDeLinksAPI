import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import AddLink from "../source/useCase/addLink/AddLink";
import CreateUser from "../source/useCase/createUser/CreateUser";
import DeleteLink from "../source/useCase/deleteLink/DeleteLink";

const createUserAndLink = async function () {
    const createUser = new CreateUser(repositoryFactory);
    await createUser.execute({
        nick: "olokorre",
        password: "password"
    });
    const user = await repositoryFactory
        .createUserRepository()
        .findByNick('olokorre');
    const input = {
        user,
        url: 'https://music.youtube.com/',
        description: 'Youtube Music'
    }
    const addLink = new AddLink(repositoryFactory);
    return addLink.execute(input);
}

let repositoryFactory: RepositoryFactory;

beforeEach(function () {
    repositoryFactory = new MemoryRepositoryFactory();
});

test("Deve deletar um link", async function () {
    const fakeLink = await createUserAndLink();
    const deleteLink = new DeleteLink(repositoryFactory);
    const linkRepository = repositoryFactory.createLinkRepository();
    expect(linkRepository.getAll()).toHaveLength(1);
    deleteLink.execute({linkId: fakeLink.id});
    expect(linkRepository.getAll()).toHaveLength(0);
});
