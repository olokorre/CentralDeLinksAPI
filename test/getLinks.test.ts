import Link from "../source/domain/entity/Link";
import User from "../source/domain/entity/User";
import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
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
