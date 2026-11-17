import FollowRepository from "../../../domain/repository/FollowRepository";

export default class FollowRepositoryMemory implements FollowRepository {

    private follows: { followerId: string, followeeId: string }[];

    constructor() {
        this.follows = [];
    }

    async follow(followerId: string, followeeId: string): Promise<void> {
        const exists = this.follows.find(follow => follow.followerId === followerId && follow.followeeId === followeeId);
        if (!exists) this.follows.push({ followerId, followeeId });
    }

    async unfollow(followerId: string, followeeId: string): Promise<void> {
        this.follows = this.follows.filter(follow => !(follow.followerId === followerId && follow.followeeId === followeeId));
    }

    async countFollowers(userId: string): Promise<number> {
        return this.follows.filter(follow => follow.followeeId === userId).length;
    }

    async countFollowing(userId: string): Promise<number> {
        return this.follows.filter(follow => follow.followerId === userId).length;
    }

    async isFollowing(followerId: string, followeeId: string): Promise<boolean> {
        return this.follows.some(follow => follow.followerId === followerId && follow.followeeId === followeeId);
    }

    async getFollowingIds(userId: string): Promise<string[]> {
        return this.follows.filter(follow => follow.followerId === userId).map(follow => follow.followeeId);
    }

    async clear(): Promise<void> {
        this.follows = [];
    }

}
