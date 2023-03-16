import pgp from "pg-promise";
import ConfigDatabase from "./ConfigDatabase";
import Connection from "./Connection";

export default class PostgreSQLConnection implements Connection {

    protected pgp: any;

    constructor(configDatabase: ConfigDatabase) {
        this.pgp = pgp()(`postgres://${configDatabase.user}:${configDatabase.password}@${configDatabase.host}:${configDatabase.port}/${configDatabase.database}`);
    }

    execute(statement: string, params?: any[]): Promise<any[]> {
        return this.pgp.query(statement, params);
    }

    close(): Promise<void> {
        return this.pgp.$pool.end();
    }

}
