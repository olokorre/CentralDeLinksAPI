export default interface Connection {

    execute(statement: string, params?: any[]): Promise<any[]>;
    close(): Promise<void>;

}
