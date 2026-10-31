import Link from "../source/domain/entity/Link";
import User from "../source/domain/entity/User";
import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import ChangeDescription from "../source/useCase/changeDescription/ChangeDescription";
import ForbiddenError from "../source/domain/error/ForbiddenError";

let repositoryFactory: RepositoryFactory;

beforeEach(function () {
    repositoryFactory = new MemoryRepositoryFactory();
});

test("Deve mudar a descrição de um link", async function () {
    await repositoryFactory
        .createUserRepository()
        .create(new User('olokorre', 'passwd', '50817293-5046-4fd2-a967-50a0f70a3b9a'));
    await repositoryFactory
        .createLinkRepository()
        .save(new Link('https://www.youtube.com/shorts/tEiXrnarZjg', 'F22000 boladão', '50817293-5046-4fd2-a967-50a0f70a3b9a', '222c77f2-24ee-4565-8d51-d1e0148d6c76'));
    const user = await repositoryFactory
        .createUserRepository()
        .findById('50817293-5046-4fd2-a967-50a0f70a3b9a');
    const changeDescription = new ChangeDescription(repositoryFactory);
    const input = {
        user,
        linkId: '222c77f2-24ee-4565-8d51-d1e0148d6c76',
        description: 'Meu querido camião'
    };
    await changeDescription.execute(input);
    const link = await repositoryFactory
        .createLinkRepository()
        .findById('222c77f2-24ee-4565-8d51-d1e0148d6c76');
    expect(link.description).toBe('Meu querido camião');
});

test("Não deve mudar a descrição de um link que não pertence ao usuário logado", async function () {
    await repositoryFactory
        .createUserRepository()
        .create(new User('olokorre', 'passwd', '50817293-5046-4fd2-a967-50a0f70a3b9a'));
    const otherUser = await repositoryFactory
        .createUserRepository()
        .create(new User('nemo', 'passwd'));
    await repositoryFactory
        .createLinkRepository()
        .save(new Link('https://www.youtube.com/shorts/tEiXrnarZjg', 'F22000 boladão', '50817293-5046-4fd2-a967-50a0f70a3b9a', '222c77f2-24ee-4565-8d51-d1e0148d6c76'));
    const changeDescription = new ChangeDescription(repositoryFactory);
    const input = {
        user: otherUser,
        linkId: '222c77f2-24ee-4565-8d51-d1e0148d6c76',
        description: 'Meu querido camião'
    };
    await expect(changeDescription.execute(input))
        .rejects.toThrow(new ForbiddenError("You do not own this link"));
});
