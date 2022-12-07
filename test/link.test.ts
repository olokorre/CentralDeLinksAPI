import Link from "../source/domain/entity/Link";
import User from "../source/domain/entity/User";

test("Deve criar um link simples que pertence a um usuário", function () {
    const user = new User('olokorre', 'password');
    const link = new Link('https://server-foda.com:8006/', 'My proxmox', user.id);
    expect(link.url).toBe('https://server-foda.com:8006/');
    expect(link.userId).toBe(user.id);
});

test("Não deve permitir a criação de um link com URL inválida", function () {
    const user = new User('olokorre', 'password');
    expect(() => new Link('test', 'My proxmox', user.id)).toThrow(new Error('Invalid URL'));
});

test("Não deve permitir criar um link com usuário inválido", function () {
    expect(() => new Link('https://server-foda.com:8006/', 'My proxmox', 'userId')).toThrow(new Error("Invalid UserID"));
});
