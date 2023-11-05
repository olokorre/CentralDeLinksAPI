import GetLink from "../source/useCase/getLink/GetLink";
import Link from "../source/domain/entity/Link";
import User from "../source/domain/entity/User";
import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";

let repositoryFactory: RepositoryFactory;

beforeEach(function () {
    repositoryFactory = new MemoryRepositoryFactory();
});

test("Deve buscar o link do usuário logado", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const linkRepository = repositoryFactory.createLinkRepository();
    const owner = new User("olokorre", "password");
    const link = new Link("https://www.youtube.com/", "Youtube", owner.id);
    await userRepository.create(owner);
    await linkRepository.save(link);
    const getLink = new GetLink(repositoryFactory);
    const output = await getLink.execute({
        user: owner,
        linkId: link.id
    });
    expect(output.id).toBe(link.id);
    expect(output.description).toBe(link.description);
    expect(output.url).toBe(link.url);
});

test("Não deve retornar o link de outro usuário", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const linkRepository = repositoryFactory.createLinkRepository();
    const owner = new User("olokorre", "password");
    const outher = new User("nemo", "password");
    const link = new Link("https://www.youtube.com/", "Youtube", owner.id);
    await userRepository.create(owner);
    await linkRepository.save(link);
    const getLink = new GetLink(repositoryFactory);
    const input = {
        user: outher,
        linkId: link.id
    };
    await expect(getLink.execute(input)).rejects.toThrow(new Error("Link not found"));
});
