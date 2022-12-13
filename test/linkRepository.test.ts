import Link from "../source/domain/entity/Link";
import User from "../source/domain/entity/User";
import LinkRepositoryMemory from "../source/infra/repository/memory/LinkRepositoryMemory";

test("Deve salvar um link qualquer", function () {
    const user = new User('olokorre', 'password');
    const linkRepository = new LinkRepositoryMemory();
    const link = linkRepository.save(new Link('https://server-foda.com:8006/', 'My proxmox', user.id));
    expect(link.url).toBe('https://server-foda.com:8006/');
});

test("Deve deletar um link", function () {
    const user = new User('olokorre', 'password');
    const linkRepository = new LinkRepositoryMemory();
    const link = linkRepository.save(new Link('https://server-foda.com:8006/', 'My proxmox', user.id));
    expect(linkRepository.getAll()).toHaveLength(1);
    linkRepository.delete(link);
    expect(linkRepository.getAll()).toHaveLength(0);
});

test("Deve disparar um erro ao tentar deletar um link que não existe", function () {
    const user = new User('olokorre', 'password');
    const linkRepository = new LinkRepositoryMemory();
    const link = new Link('https://server-foda.com:8006/', 'My proxmox', user.id);
    expect(() => linkRepository.delete(link)).toThrow(new Error("Link not found"));
});

test("Não deve permitir salvar dois links com a mesma URL", function () {
    const user = new User('olokorre', 'password');
    const linkRepository = new LinkRepositoryMemory();
    const link1 = new Link('https://server-foda.com:8006/', 'My proxmox', user.id);
    const link2 = new Link('https://server-foda.com:8006/', 'My homeserver', user.id);
    linkRepository.save(link1);
    expect(() => linkRepository.save(link2)).toThrow(new Error("URL already exists"));
});

test("Deve permitir salvar a mesma URL para dois usuários diferentes", function () {
    const user1 = new User('olokorre', 'password');
    const user2 = new User('nemo', 'password');
    const linkRepository = new LinkRepositoryMemory();
    const link1 = new Link('https://server-foda.com:8006/', 'My proxmox', user1.id);
    const link2 = new Link('https://server-foda.com:8006/', 'My homeserver', user2.id);
    linkRepository.save(link1);
    linkRepository.save(link2);
    expect(linkRepository.getAll()).toHaveLength(2);
});

test("Deve buscar um link pelo seu id", function () {
    const user = new User('olokorre', 'password');
    const linkRepository = new LinkRepositoryMemory();
    const link = linkRepository.save(new Link('https://server-foda.com:8006/', 'My proxmox', user.id));
    const outherLink = linkRepository.findById(link.id);
    expect(outherLink).toBe(outherLink);
});

test("Deve disparar um erro ao tentar buscar um link que não existe", function () {
    const linkRepository = new LinkRepositoryMemory();
    expect(() => linkRepository.findById('link id :)')).toThrow(new Error("Link not found"));
});
