import Link from "../source/domain/entity/Link";
import User from "../source/domain/entity/User";
import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import NotFoundError from "../source/domain/error/NotFoundError";
import ValidationError from "../source/domain/error/ValidationError";
import ForbiddenError from "../source/domain/error/ForbiddenError";
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

test("Não deve compartilhar um link inexistente", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const user1 = await userRepository.create(new User("olokorre", "password"));
    const user2 = await userRepository.create(new User("nemo", "password"));
    const shareLink = new ShareLink(repositoryFactory);
    await expect(shareLink.execute({
        user: user1,
        linkId: "link-inexistente",
        userIdToShareLink: user2.id
    })).rejects.toThrow(new NotFoundError("Link not found"));
});

test("Não deve compartilhar um link que não pertence ao usuário logado", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const linkRepository = repositoryFactory.createLinkRepository();
    const user1 = await userRepository.create(new User("olokorre", "password"));
    const user2 = await userRepository.create(new User("nemo", "password"));
    const user3 = await userRepository.create(new User("batatajuj", "password"));
    const linkUser1 = await linkRepository.save(new Link("https://discord.com/", "Discord App", user1.id));
    const shareLink = new ShareLink(repositoryFactory);
    await expect(shareLink.execute({
        user: user2,
        linkId: linkUser1.id,
        userIdToShareLink: user3.id
    })).rejects.toThrow(new ForbiddenError("You do not own this link"));
});

test("Não deve compartilhar um link para um usuário que não existe", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const linkRepository = repositoryFactory.createLinkRepository();
    const user1 = await userRepository.create(new User("olokorre", "password"));
    const linkUser1 = await linkRepository.save(new Link("https://discord.com/", "Discord App", user1.id));
    const shareLink = new ShareLink(repositoryFactory);
    await expect(shareLink.execute({
        user: user1,
        linkId: linkUser1.id,
        userIdToShareLink: "id-de-usuario-inexistente"
    })).rejects.toThrow(new NotFoundError("User not found"));
});

test("Não deve compartilhar um link para si mesmo", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const linkRepository = repositoryFactory.createLinkRepository();
    const user1 = await userRepository.create(new User("olokorre", "password"));
    const linkUser1 = await linkRepository.save(new Link("https://discord.com/", "Discord App", user1.id));
    const shareLink = new ShareLink(repositoryFactory);
    await expect(shareLink.execute({
        user: user1,
        linkId: linkUser1.id,
        userIdToShareLink: user1.id
    })).rejects.toThrow(new ValidationError("You cannot share a link with yourself"));
    expect(await linkRepository.getAll()).toHaveLength(1);
});
