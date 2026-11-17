import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import GetFeed from "../../useCase/getFeed/GetFeed";
import GetFeedInput from "../../useCase/getFeed/GetFeedInput";
import GetFeedOutput from "../../useCase/getFeed/GetFeedOutput";

export default class FeedController {

    constructor(readonly repositoryFactory: RepositoryFactory) {
    }

    async getFeed(input: GetFeedInput): Promise<GetFeedOutput> {
        const getFeed = new GetFeed(this.repositoryFactory);
        return await getFeed.execute(input);
    }

}
