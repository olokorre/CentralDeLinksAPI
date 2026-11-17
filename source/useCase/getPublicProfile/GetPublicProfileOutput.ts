interface PublicLink {

    id: string;
    description: string;
    url: string;
    createdAt: string;

}

export default interface GetPublicProfileOutput {

    nick: string;
    bio: string;
    createdAt: string;
    links: PublicLink[];
    followers: number;
    following: number;
    isFollowing?: boolean;

}
