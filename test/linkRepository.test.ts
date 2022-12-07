import Link from "../source/domain/entity/Link";
import User from "../source/domain/entity/User";
import LinkRepositoryMemory from "../source/infra/repository/memory/LinkRepositoryMemory";

test("Deve salvar um link qualquer", function () {
    const user = new User('olokorre', 'password');
    const linkRepository = new LinkRepositoryMemory();
    const link = linkRepository.save(new Link('https://server-foda.com:8006/', 'My proxmox', user.id));
    expect(link.url).toBe('https://server-foda.com:8006/');
});
