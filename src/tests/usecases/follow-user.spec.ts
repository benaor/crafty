import {
  FollowingFixture,
  createFollowingFixture,
} from "../fixtures/following.fixture";

describe("Feature: Following a user", () => {
  let fixture: FollowingFixture;

  beforeEach(() => {
    fixture = createFollowingFixture();
  });

  test("Alice can follow Bob", async () => {
    fixture.givenUserFollows({
      user: "Alice",
      followedUsers: ["Charlie"],
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
