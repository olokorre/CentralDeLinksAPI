export default interface Connection {

    execute(statement: string): Promise<any[]>;
    close(): Promise<void>;

}
