export default interface FollowRepository {

    follow(followerId: string, followeeId: string): Promise<void>;
    unfollow(followerId: string, followeeId: string): Promise<void>;
    countFollowers(userId: string): Promise<number>;
    countFollowing(userId: string): Promise<number>;
    isFollowing(followerId: string, followeeId: string): Promise<boolean>;
    getFollowingIds(userId: string): Promise<string[]>;
    clear(): Promise<void>;

}
