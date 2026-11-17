interface Link {

    id: string;
    description: string;
    url: string;
    isPublic: boolean;

}

export default interface GetLinksOutput {

    links: Link[];

}
