import Link from "../source/domain/entity/Link";
import User from "../source/domain/entity/User";
import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import ValidationError from "../source/domain/error/ValidationError";
import GetLinks from "../source/useCase/getLinks/GetLinks";

let repositoryFactory: RepositoryFactory;

beforeEach(function () {
    repositoryFactory = new MemoryRepositoryFactory();
});

test("Deve devolver todos os links de um usuário", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const linkRepository = repositoryFactory.createLinkRepository();
    const user = new User("olokorre", "password");
    userRepository.create(user);
    linkRepository.save(new Link("https://www.youtube.com/", "Youtube", user.id));
    linkRepository.save(new Link("https://github.com/", "Github", user.id));
    const getLinks = new GetLinks(repositoryFactory);
    const output = await getLinks.execute({user});
    expect(output.links).toHaveLength(2);
});

test("Deve paginar os links de um usuário", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const linkRepository = repositoryFactory.createLinkRepository();
    const user = new User("olokorre", "password");
    userRepository.create(user);
    await linkRepository.save(new Link("https://www.youtube.com/", "Youtube", user.id));
    await linkRepository.save(new Link("https://github.com/", "Github", user.id));
    await linkRepository.save(new Link("https://gitlab.com/", "Gitlab", user.id));
    const getLinks = new GetLinks(repositoryFactory);
    const firstPage = await getLinks.execute({user, page: 1, limit: 2});
    const secondPage = await getLinks.execute({user, page: 2, limit: 2});
    expect(firstPage.links).toHaveLength(2);
    expect(secondPage.links).toHaveLength(1);
    expect(firstPage.links.map(link => link.url)).toEqual(['https://www.youtube.com/', 'https://github.com/']);
    expect(secondPage.links.map(link => link.url)).toEqual(['https://gitlab.com/']);
});

test("Deve limitar o limite máximo dos links de um usuário", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const linkRepository = repositoryFactory.createLinkRepository();
    const user = new User("olokorre", "password");
    userRepository.create(user);
    await linkRepository.save(new Link("https://www.youtube.com/", "Youtube", user.id));
    await linkRepository.save(new Link("https://github.com/", "Github", user.id));
    await linkRepository.save(new Link("https://gitlab.com/", "Gitlab", user.id));
    const getLinks = new GetLinks(repositoryFactory);
    const output = await getLinks.execute({user, limit: 500});
    expect(output.links).toHaveLength(3);
});

test("Não deve paginar com página inválida", async function () {
    const user = new User("olokorre", "password");
    const getLinks = new GetLinks(repositoryFactory);
    await expect(getLinks.execute({user, page: 0})).rejects.toThrow(new ValidationError("Invalid page"));
    await expect(getLinks.execute({user, limit: 0})).rejects.toThrow(new ValidationError("Invalid limit"));
});
