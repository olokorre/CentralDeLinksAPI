import PostgreSQLConnection from "../source/infra/database/PostgreSQLConnection";
import configDatabase from "./configDatabase";

test("Deve ciar uma connexão com o banco de dados PostgreSQL", async function () {
    const connection = new PostgreSQLConnection(configDatabase);
    const [output] = await connection.execute('SHOW SERVER_VERSION;');
    await connection.close();
    expect(output['server_version']).toBeTruthy();
});
