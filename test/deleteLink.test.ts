import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import AddLink from "../source/useCase/addLink/AddLink";
import CreateUser from "../source/useCase/createUser/CreateUser";
import DeleteLink from "../source/useCase/deleteLink/DeleteLink";
import ForbiddenError from "../source/domain/error/ForbiddenError";
import User from "../source/domain/entity/User";

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
    const user = await repositoryFactory
        .createUserRepository()
        .findByNick('olokorre');
    const deleteLink = new DeleteLink(repositoryFactory);
    const linkRepository = repositoryFactory.createLinkRepository();
    expect(await linkRepository.getAll()).toHaveLength(1);
    await deleteLink.execute({user, linkId: fakeLink.id});
    expect(await linkRepository.getAll()).toHaveLength(0);
});

test("Não deve deletar um link que não pertence ao usuário logado", async function () {
    const fakeLink = await createUserAndLink();
    const otherUser = await repositoryFactory
        .createUserRepository()
        .create(new User("nemo", "password"));
    const deleteLink = new DeleteLink(repositoryFactory);
    const linkRepository = repositoryFactory.createLinkRepository();
    await expect(deleteLink.execute({user: otherUser, linkId: fakeLink.id}))
        .rejects.toThrow(new ForbiddenError("You do not own this link"));
    expect(await linkRepository.getAll()).toHaveLength(1);
});
