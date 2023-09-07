import { FollowersRepository } from "../../domain/ports/FollowersRepository";

export type FollowUserCommand = {
  user: string;
  follow: string;
};

export class FollowUserUseCase {
  constructor(private followersRepository: FollowersRepository) {}

  async handle(followUserCommand: FollowUserCommand) {
    return this.followersRepository.saveFollowed({
      user: followUserCommand.user,
      followed: followUserCommand.follow,
    });
  }
}
