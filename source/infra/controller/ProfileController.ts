import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import EditProfile from "../../useCase/editProfile/EditProfile";
import EditProfileInput from "../../useCase/editProfile/EditProfileInput";
import EditProfileOutput from "../../useCase/editProfile/EditProfileOutput";
import Follow from "../../useCase/follow/Follow";
import GetPublicProfile from "../../useCase/getPublicProfile/GetPublicProfile";
import GetPublicProfileOutput from "../../useCase/getPublicProfile/GetPublicProfileOutput";
import Unfollow from "../../useCase/follow/Unfollow";
import Auth from "../http/middleware/Auth";

export default class ProfileController {

    constructor(protected repositoryFactory: RepositoryFactory, protected auth: Auth) {
    }

    async getPublicProfile(params: any, headers: any = {}): Promise<GetPublicProfileOutput> {
        const token = headers?.["access-token"];
        let viewerId: string | undefined;
        if (token) {
            const viewer = await this.auth.authenticate(token);
            viewerId = viewer?.id;
        }
        const getPublicProfile = new GetPublicProfile(this.repositoryFactory);
        return await getPublicProfile.execute({ nick: params.nick, viewerId });
    }

    async editProfile(input: EditProfileInput): Promise<EditProfileOutput> {
        const editProfile = new EditProfile(this.repositoryFactory);
        return await editProfile.execute(input);
    }

    async follow(params: any, user: any): Promise<void> {
        const follow = new Follow(this.repositoryFactory);
        await follow.execute({ user, nick: params.nick });
    }

    async unfollow(params: any, user: any): Promise<void> {
        const unfollow = new Unfollow(this.repositoryFactory);
        await unfollow.execute({ user, nick: params.nick });
    }

}
