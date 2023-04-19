interface Link {

    id: string;
    description: string;
    url: string;

}

export default interface GetLinksOutput {

    links: Link[];

}
