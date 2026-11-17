import RepositoryFactory from "../../domain/repository/RepositoryFactory";
import UserRepository from "../../domain/repository/UserRepository";
import ValidationError from "../../domain/error/ValidationError";
import EditProfileInput from "./EditProfileInput";
import EditProfileOutput from "./EditProfileOutput";

export default class EditProfile {

    protected userRepository: UserRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.userRepository = repositoryFactory.createUserRepository();
    }

    async execute(input: EditProfileInput): Promise<EditProfileOutput> {
        if (typeof input.bio !== "string") throw new ValidationError("Bio is required");
        if (input.bio.length > 280) throw new ValidationError("Bio must have at most 280 characters");
        await this.userRepository.updateBio(input.user, input.bio);
        return {
            nick: input.user.nick,
            bio: input.bio
        };
    }

}
