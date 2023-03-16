import Link from "../source/domain/entity/Link";
import User from "../source/domain/entity/User";
import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import ShareLink from "../source/useCase/shareLink/ShareLink";

let repositoryFactory: RepositoryFactory;

beforeEach(function () {
    repositoryFactory = new MemoryRepositoryFactory();
});

test("Deve comprartilhar um link", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const linkRepository = repositoryFactory.createLinkRepository();
    const user1 = await userRepository.create(new User("olokorre", "password"));
    const user2 = await userRepository.create(new User("nemo", "password"));
    const linkUser1 = await linkRepository.save(new Link("https://discord.com/", "Discord App", user1.id));
    expect(await linkRepository.getAll()).toHaveLength(1);
    const shareLink = new ShareLink(repositoryFactory);
    await shareLink.execute({
        user: user1,
        linkId: linkUser1.id,
        userIdToShareLink: user2.id
    });
    expect(await linkRepository.getAll()).toHaveLength(2);
});
