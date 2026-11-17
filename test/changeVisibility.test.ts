import Link from "../source/domain/entity/Link";
import User from "../source/domain/entity/User";
import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import ChangeVisibility from "../source/useCase/changeVisibility/ChangeVisibility";
import NotFoundError from "../source/domain/error/NotFoundError";
import ValidationError from "../source/domain/error/ValidationError";

let repositoryFactory: RepositoryFactory;

beforeEach(function () {
    repositoryFactory = new MemoryRepositoryFactory();
});

test("Deve alternar a visibilidade de um link para público", async function () {
    await repositoryFactory
        .createUserRepository()
        .create(new User('olokorre', 'passwd', '50817293-5046-4fd2-a967-50a0f70a3b9a'));
    await repositoryFactory
        .createLinkRepository()
        .save(new Link('https://www.youtube.com/shorts/tEiXrnarZjg', 'F22000 boladão', '50817293-5046-4fd2-a967-50a0f70a3b9a', '222c77f2-24ee-4565-8d51-d1e0148d6c76'));
    const user = await repositoryFactory
        .createUserRepository()
        .findById('50817293-5046-4fd2-a967-50a0f70a3b9a');
    const changeVisibility = new ChangeVisibility(repositoryFactory);
    const input = {
        user,
        linkId: '222c77f2-24ee-4565-8d51-d1e0148d6c76',
        isPublic: true
    };
    await changeVisibility.execute(input);
    const linkRepository = repositoryFactory.createLinkRepository();
    const link = await linkRepository.findById('222c77f2-24ee-4565-8d51-d1e0148d6c76');
    expect(link.isPublic).toBe(true);
    expect(await linkRepository.getPublicLinksByUser(user)).toHaveLength(1);
});

test("Deve alternar a visibilidade de um link para privado", async function () {
    await repositoryFactory
        .createUserRepository()
        .create(new User('olokorre', 'passwd', '50817293-5046-4fd2-a967-50a0f70a3b9a'));
    await repositoryFactory
        .createLinkRepository()
        .save(new Link('https://www.youtube.com/shorts/tEiXrnarZjg', 'F22000 boladão', '50817293-5046-4fd2-a967-50a0f70a3b9a', '222c77f2-24ee-4565-8d51-d1e0148d6c76', true));
    const user = await repositoryFactory
        .createUserRepository()
        .findById('50817293-5046-4fd2-a967-50a0f70a3b9a');
    const changeVisibility = new ChangeVisibility(repositoryFactory);
    const input = {
        user,
        linkId: '222c77f2-24ee-4565-8d51-d1e0148d6c76',
        isPublic: false
    };
    await changeVisibility.execute(input);
    const linkRepository = repositoryFactory.createLinkRepository();
    const link = await linkRepository.findById('222c77f2-24ee-4565-8d51-d1e0148d6c76');
    expect(link.isPublic).toBe(false);
    expect(await linkRepository.getPublicLinksByUser(user)).toHaveLength(0);
});

test("Não deve alternar a visibilidade de um link que não pertence ao usuário logado", async function () {
    await repositoryFactory
        .createUserRepository()
        .create(new User('olokorre', 'passwd', '50817293-5046-4fd2-a967-50a0f70a3b9a'));
    const otherUser = await repositoryFactory
        .createUserRepository()
        .create(new User('nemo', 'passwd'));
    await repositoryFactory
        .createLinkRepository()
        .save(new Link('https://www.youtube.com/shorts/tEiXrnarZjg', 'F22000 boladão', '50817293-5046-4fd2-a967-50a0f70a3b9a', '222c77f2-24ee-4565-8d51-d1e0148d6c76'));
    const changeVisibility = new ChangeVisibility(repositoryFactory);
    const input = {
        user: otherUser,
        linkId: '222c77f2-24ee-4565-8d51-d1e0148d6c76',
        isPublic: true
    };
    await expect(changeVisibility.execute(input))
        .rejects.toThrow(new NotFoundError("Link not found"));
    const link = await repositoryFactory
        .createLinkRepository()
        .findById('222c77f2-24ee-4565-8d51-d1e0148d6c76');
    expect(link.isPublic).toBe(false);
});

test("Não deve alternar a visibilidade de um link inexistente", async function () {
    const user = await repositoryFactory
        .createUserRepository()
        .create(new User('olokorre', 'passwd'));
    const changeVisibility = new ChangeVisibility(repositoryFactory);
    const input = {
        user,
        linkId: '222c77f2-24ee-4565-8d51-d1e0148d6c76',
        isPublic: true
    };
    await expect(changeVisibility.execute(input))
        .rejects.toThrow(new NotFoundError("Link not found"));
});

test("Não deve alternar a visibilidade com isPublic inválido", async function () {
    await repositoryFactory
        .createUserRepository()
        .create(new User('olokorre', 'passwd', '50817293-5046-4fd2-a967-50a0f70a3b9a'));
    await repositoryFactory
        .createLinkRepository()
        .save(new Link('https://www.youtube.com/shorts/tEiXrnarZjg', 'F22000 boladão', '50817293-5046-4fd2-a967-50a0f70a3b9a', '222c77f2-24ee-4565-8d51-d1e0148d6c76'));
    const user = await repositoryFactory
        .createUserRepository()
        .findById('50817293-5046-4fd2-a967-50a0f70a3b9a');
    const changeVisibility = new ChangeVisibility(repositoryFactory);
    const input = {
        user,
        linkId: '222c77f2-24ee-4565-8d51-d1e0148d6c76',
        isPublic: 'sim' as any
    };
    await expect(changeVisibility.execute(input))
        .rejects.toThrow(new ValidationError("Invalid isPublic"));
});
