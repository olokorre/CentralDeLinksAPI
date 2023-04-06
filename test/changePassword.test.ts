import RepositoryFactory from "../source/domain/repository/RepositoryFactory";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import ChangePassword from "../source/useCase/changePassword/ChangePassword";
import CreateUser from "../source/useCase/createUser/CreateUser";
import LoginUser from "../source/useCase/loginUser/LoginUser";

let repositoryFactory: RepositoryFactory;

beforeEach(function () {
    repositoryFactory = new MemoryRepositoryFactory();
});

test("Deve mudar a senha de um usuário", async function () {
    const createUser = new CreateUser(repositoryFactory);
    await createUser.execute({
        nick: 'olokorre',
        password: 'password'
    });
    const user = await repositoryFactory
        .createUserRepository()
        .findByNick('olokorre');
    const input = {
        user,
        password: 'password',
        newPassword: 'new_password_strong',
        rePassword: 'new_password_strong'
    };
    const changePassword = new ChangePassword(repositoryFactory);
    await changePassword.execute(input);
    const loginUser = new LoginUser(repositoryFactory);
    const loginInput = {
        nick: 'olokorre',
        password: 'password'
    };
    await expect(loginUser.execute(loginInput)).rejects.toThrow(new Error("Invalid credentials"));
});

test("Não deve mudar a senha de um usuário caso as novas senhas não sejam iguais", async function () {
    const createUser = new CreateUser(repositoryFactory);
    await createUser.execute({
        nick: 'olokorre',
        password: 'password'
    });
    const user = await repositoryFactory
        .createUserRepository()
        .findByNick('olokorre');
    const input = {
        user,
        password: 'password',
        newPassword: 'new_password_strong',
        rePassword: 'old_password_strong'
    };
    const changePassword = new ChangePassword(repositoryFactory);
    await expect(changePassword.execute(input)).rejects.toThrow(new Error("The new passwords are not the same"));
});

test("Não deve mudar a senha caso a nova senha tenha menos que 6 caracteres", async function () {
    const createUser = new CreateUser(repositoryFactory);
    await createUser.execute({
        nick: 'olokorre',
        password: 'password'
    });
    const user = await repositoryFactory
        .createUserRepository()
        .findByNick('olokorre');
    const input = {
        user,
        password: 'password',
        newPassword: 'test',
        rePassword: 'test'
    };
    const changePassword = new ChangePassword(repositoryFactory);
    await expect(changePassword.execute(input)).rejects.toThrow(new Error("Invalid password"));
});

test("Não deve mudar a senha de um usuário caso as senha a senha atual seja deferente do usuário cadastrado", async function () {
    const createUser = new CreateUser(repositoryFactory);
    await createUser.execute({
        nick: 'olokorre',
        password: 'password'
    });
    const user = await repositoryFactory
        .createUserRepository()
        .findByNick('olokorre');
    const input = {
        user,
        password: 'another_password',
        newPassword: 'new_password_strong',
        rePassword: 'new_password_strong'
    };
    const changePassword = new ChangePassword(repositoryFactory);
    await expect(changePassword.execute(input)).rejects.toThrow(new Error("Invalid credentials"));
});

test("Não deve mudar a senha de um usuário caso a nova senha seja igual a atual", async function () {
    const createUser = new CreateUser(repositoryFactory);
    await createUser.execute({
        nick: 'olokorre',
        password: 'password'
    });
    const user = await repositoryFactory
        .createUserRepository()
        .findByNick('olokorre');
    const input = {
        user,
        password: 'password',
        newPassword: 'password',
        rePassword: 'password'  
    };
    const changePassword = new ChangePassword(repositoryFactory);
    await expect(changePassword.execute(input)).rejects.toThrow(new Error("Same password"));
});
