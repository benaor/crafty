import {
  FollowUserUseCase,
  FollowUserCommand,
} from "../../application/usecases/follow-user.usecase";
import { InMemoryFollowersRepository } from "../../infra/InMemoryFollowersRepository";

export const createFollowingFixture = () => {
  const followersRepository = new InMemoryFollowersRepository();
  const followUserUseCase = new FollowUserUseCase(followersRepository);
  return {
    givenUserFollows: ({
      user,
      followedUsers,
    }: {
      user: string;
      followedUsers: string[];
    }) => {
      followersRepository.givenExistingFollowed(
        followedUsers.map((followed) => ({ user, followed }))
      );
    },
    whenUserFollows: async (followUserCommand: FollowUserCommand) => {
      await followUserUseCase.handle(followUserCommand);
    },
    thenUserFollowedAre: async (userFollowed: {
      user: string;
      followed: string[];
    }) => {
      const actualFollowed = await followersRepository.getFollowedOf(
        userFollowed.user
      );
      expect(actualFollowed).toEqual(userFollowed.followed);
    },
    followersRepository,
  };
};

export type FollowingFixture = ReturnType<typeof createFollowingFixture>;
