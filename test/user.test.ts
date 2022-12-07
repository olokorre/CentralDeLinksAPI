import User from "../source/domain/entity/User";

test("Deve criar um usuário simples", function () {
    const user = new User('olokorre', 'password');
    expect(user.nick).toBe('olokorre');
});

