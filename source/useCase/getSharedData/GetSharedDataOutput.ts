export default interface GetSharedDataOutput {

    id?: string;
    user1: { id: string, nick: string };
    user2: { id: string, nick: string };
    data: string;

}
