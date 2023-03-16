import Link from "../source/domain/entity/Link";
import User from "../source/domain/entity/User";
import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import LinkRepositoryMemory from "../source/infra/repository/memory/LinkRepositoryMemory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";

let repositoryFactory: RepositoryFactory;

beforeEach(async function () {
    repositoryFactory = new MemoryRepositoryFactory();
    const linkRepository = repositoryFactory.createLinkRepository();
    await linkRepository.clear();
});

test("Deve salvar um link qualquer", async function () {
    const user = new User('olokorre', 'password');
    const linkRepository = new LinkRepositoryMemory();
    const link = await linkRepository.save(new Link('https://server-foda.com:8006/', 'My proxmox', user.id));
    expect(link.url).toBe('https://server-foda.com:8006/');
});

test("Deve deletar um link", async function () {
    const user = new User('olokorre', 'password');
    const linkRepository = new LinkRepositoryMemory();
    const link = await linkRepository.save(new Link('https://server-foda.com:8006/', 'My proxmox', user.id));
    expect(await linkRepository.getAll()).toHaveLength(1);
    await linkRepository.delete(link);
    expect(await linkRepository.getAll()).toHaveLength(0);
});

test("Deve disparar um erro ao tentar deletar um link que não existe", async function () {
    const user = new User('olokorre', 'password');
    const linkRepository = new LinkRepositoryMemory();
    const link = new Link('https://server-foda.com:8006/', 'My proxmox', user.id);
    expect(linkRepository.delete(link)).rejects.toThrow(new Error("Link not found"));
});

test("Não deve permitir salvar dois links com a mesma URL", async function () {
    const user = new User('olokorre', 'password');
    const linkRepository = new LinkRepositoryMemory();
    const link1 = new Link('https://server-foda.com:8006/', 'My proxmox', user.id);
    const link2 = new Link('https://server-foda.com:8006/', 'My homeserver', user.id);
    await linkRepository.save(link1);
    expect(linkRepository.save(link2)).rejects.toThrow(new Error("URL already exists"));
});

test("Deve permitir salvar a mesma URL para dois usuários diferentes", async function () {
    const user1 = new User('olokorre', 'password');
    const user2 = new User('nemo', 'password');
    const linkRepository = new LinkRepositoryMemory();
    const link1 = new Link('https://server-foda.com:8006/', 'My proxmox', user1.id);
    const link2 = new Link('https://server-foda.com:8006/', 'My homeserver', user2.id);
    await linkRepository.save(link1);
    await linkRepository.save(link2);
    expect(await linkRepository.getAll()).toHaveLength(2);
});

test("Deve buscar um link pelo seu id", async function () {
    const user = new User('olokorre', 'password');
    const linkRepository = new LinkRepositoryMemory();
    const link = await linkRepository.save(new Link('https://server-foda.com:8006/', 'My proxmox', user.id));
    const outherLink = linkRepository.findById(link.id);
    expect(outherLink).toBe(outherLink);
});

test("Deve disparar um erro ao tentar buscar um link que não existe", async function () {
    const linkRepository = new LinkRepositoryMemory();
    expect(linkRepository.findById('link id :)')).rejects.toThrow(new Error("Link not found"));
});
