import Link from "../source/domain/entity/Link";
import User from "../source/domain/entity/User";

test("Deve criar um usuário simples", function () {
    const user = new User('olokorre', 'password');
    expect(user.nick).toBe('olokorre');
});

test("Deve aticionar links a um usuário", function () {
    const user = new User('olokorre', 'password');
    const link = new Link('https://server-foda.com:8006/', 'My proxmox', user.id);
    user.store(link);
    const [userLink] = user.links;
    expect(user.totalLinks).toBe(1);
    expect(userLink.id).toBe(link.id);
    expect(userLink.description).toBe(link.description);
    expect(userLink.url).toBe(link.url);
});

test("Deve permitir a remossão de um link", function () {
    const user = new User('olokorre', 'password');
    const link = new Link('https://server-foda.com:8006/', 'My proxmox', user.id);
    user.store(link);
    user.remove(link);
    expect(user.totalLinks).toBe(0);
});

test("Não deve permitir a remossão de um link caso ele não esteje em um usuário", function () {
    const user = new User('olokorre', 'password');
    const link = new Link('https://server-foda.com:8006/', 'My proxmox', user.id);
    expect(() => user.remove(link)).toThrow(new Error('Link not found'));
});
