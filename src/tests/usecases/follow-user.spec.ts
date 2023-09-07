import {
  FollowUserCommand,
  FollowUserUseCase,
} from "../../application/usecases/follow-user.usecase";
import { InMemoryFollowersRepository } from "../../infra/InMemoryFollowersRepository";

describe("Feature: Following a user", () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  test("Alice can follow Bob", async () => {
    fixture.givenUserFollows({
      user: "Alice",
      followed: ["Charlie"],
    });

    await fixture.whenUserFollows({
      user: "Alice",
      follow: "Bob",
    });

    await fixture.thenUserFollowedAre({
      user: "Alice",
      followed: ["Charlie", "Bob"],
    });
  });
});

const createFixture = () => {
  const followersRepository = new InMemoryFollowersRepository();
  const followUserUseCase = new FollowUserUseCase(followersRepository);
  return {
    givenUserFollows: ({
      user,
      followed,
    }: {
      user: string;
      followed: string[];
    }) => {
      followersRepository.givenExistingFollowed(
        followed.map((followed) => ({ user, followed }))
      );
    },
    whenUserFollows: async (followUserCommand: FollowUserCommand) => {
      await followUserUseCase.handle(followUserCommand);
    },
    thenUserFollowedAre: async (userFollowed: {
      user: string;
      followed: string[];
    }) => {
      const actualFollowed = followersRepository.getFollowedOf(
        userFollowed.user
      );
      expect(actualFollowed).toEqual(userFollowed.followed);
    },
  };
};
type Fixture = ReturnType<typeof createFixture>;
