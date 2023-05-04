import Link from "../source/domain/entity/Link";
import User from "../source/domain/entity/User";
import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import ChangeDescription from "../source/useCase/changeDescription/ChangeDescription";

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
    const changeDescription = new ChangeDescription(repositoryFactory);
    const input = {
        linkId: '222c77f2-24ee-4565-8d51-d1e0148d6c76',
        description: 'Meu querido camião'
    };
    await changeDescription.execute(input);
    const link = await repositoryFactory
        .createLinkRepository()
        .findById('222c77f2-24ee-4565-8d51-d1e0148d6c76');
    expect(link.description).toBe('Meu querido camião');
});
