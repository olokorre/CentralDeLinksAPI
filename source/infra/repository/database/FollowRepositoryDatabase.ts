import FollowRepository from "../../../domain/repository/FollowRepository";
import Connection from "../../database/Connection";

export default class FollowRepositoryDatabase implements FollowRepository {

    constructor(protected connection: Connection) {
    }

    async follow(followerId: string, followeeId: string): Promise<void> {
        await this.connection.execute("insert into public.follow (follower_id, followee_id) values ($1, $2) on conflict do nothing", [followerId, followeeId]);
    }

    async unfollow(followerId: string, followeeId: string): Promise<void> {
        await this.connection.execute("delete from public.follow where follower_id = $1 and followee_id = $2", [followerId, followeeId]);
    }

    async countFollowers(userId: string): Promise<number> {
        const [result] = await this.connection.execute("select count(*) as total from public.follow where followee_id = $1", [userId]);
        return Number(result?.total ?? 0);
    }

    async countFollowing(userId: string): Promise<number> {
        const [result] = await this.connection.execute("select count(*) as total from public.follow where follower_id = $1", [userId]);
        return Number(result?.total ?? 0);
    }

    async isFollowing(followerId: string, followeeId: string): Promise<boolean> {
        const [result] = await this.connection.execute("select 1 from public.follow where follower_id = $1 and followee_id = $2", [followerId, followeeId]);
        return Boolean(result);
    }

    async getFollowingIds(userId: string): Promise<string[]> {
        const results = await this.connection.execute("select followee_id from public.follow where follower_id = $1", [userId]);
        return results.map((result: any) => result.followee_id);
    }

    async clear(): Promise<void> {
        await this.connection.execute("delete from public.follow");
    }

}
