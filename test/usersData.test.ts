import User from "../source/domain/entity/User";
import UsersData from "../source/domain/entity/UsersData";

test("Deve criar um dado compartilhado entre dois usuários", function () {
    const user1 = new User("olokorre", "password");
    const user2 = new User("nemo", "password");
    const data = `
        #!/bin/python
        
        name = input('Your name: ')
        print(f'Hello, {name}')
    `;
    const usersData = new UsersData(user1, user2, data);
    expect(usersData.data).toBe(data);
});

test("Deve alterar o dado compartilhado", function () {
    const user1 = new User("olokorre", "password");
    const user2 = new User("nemo", "password");
    const usersData = new UsersData(user1, user2);
    expect(usersData.data).toBe("");
    usersData.update("Olá mundo!");
    expect(usersData.data).toBe("Olá mundo!");
});
