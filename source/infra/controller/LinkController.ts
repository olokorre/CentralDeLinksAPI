import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import AddLink from "../../useCase/addLink/AddLink";
import AddLinkInput from "../../useCase/addLink/AddLinkInput";
import AddLinkOutput from "../../useCase/addLink/AddLinkOutput";
import DeleteLink from "../../useCase/deleteLink/DeleteLink";
import DeleteLinkInput from "../../useCase/deleteLink/DeleteLinkInput";
import GetLinks from "../../useCase/getLinks/GetLinks";
import GetLinksInput from "../../useCase/getLinks/GetLinksInput";
import GetLinksOutput from "../../useCase/getLinks/GetLinksOutput";
import ShareLink from "../../useCase/shareLink/ShareLink";
import ShareLinkInput from "../../useCase/shareLink/ShareLinkInput";

export default class LinkController {

    constructor(readonly repositoryFactory: RepositoryFactory) {
    }

    async addLink(input: AddLinkInput): Promise<AddLinkOutput> {
        const addLink = new AddLink(this.repositoryFactory);
        return await addLink.execute(input);
    }

    async getLinks(input: GetLinksInput): Promise<GetLinksOutput> {
        const getLinks = new GetLinks(this.repositoryFactory);
        return await getLinks.execute(input);
    }

    async deleteLink(input: DeleteLinkInput): Promise<object> {
        const deleteLink = new DeleteLink(this.repositoryFactory);
        await deleteLink.execute(input);
        return {
            message: "Link deleted"
        }
    }

    async shareLink(input: ShareLinkInput): Promise<object> {
        const shareLink = new ShareLink(this.repositoryFactory);
        await shareLink.execute(input);
        return {
            message: "ok"
        }
    }

}
