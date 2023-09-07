import {
  FollowingFixture,
  createFollowingFixture,
} from "../fixtures/following.fixture";
import {
  MessagingFixture,
  createMessagingFixture,
} from "../fixtures/messaging.fixture";
import { messageBuilder } from "../fixtures/message.builder";
import {
  ViewWallUseCase,
  Wall,
} from "../../application/usecases/view-wall.usecase";
import { InMemoryFollowersRepository } from "../../infra/InMemoryFollowersRepository";
import { InMemoryMessageRepository } from "../../infra/InMemoryMessageRepository";
import { StubDateProvider } from "../../infra/StubDateProvider";

describe("Feature: Viewing a user's wall", () => {
  let followingFixture: FollowingFixture;
  let messagingFixture: MessagingFixture;
  let fixture: Fixture;

  beforeEach(() => {
    followingFixture = createFollowingFixture();
    messagingFixture = createMessagingFixture();
    fixture = createFixture({
      messageRepository: messagingFixture.messageRepository,
      followersRepository: followingFixture.followersRepository,
    });
  });

  describe("Rule: All the messages from thhe user and her followed users should be displayed in reverse chronological order", () => {
    test("Charlie can subscribes to Alice's timelines, and view an aggregated list of all subscriptions", async () => {
      fixture.givenNowIs(new Date("2023-02-09T15:15:30.000Z"));
      messagingFixture.givenTheFollowingMessagesExist([
        messageBuilder()
          .authoredBy("Alice")
          .withId("m1")
          .withText("I love the weather today")
          .publishedAt(new Date("2023-02-09T15:00:30.000Z"))
          .build(),
        messageBuilder()
          .authoredBy("Bob")
          .withId("m2")
          .withText("Damn! We lost!")
          .publishedAt(new Date("2023-02-09T15:01:00.000Z"))
          .build(),
        messageBuilder()
          .authoredBy("Charlie")
          .withId("m3")
          .withText("I'm in New York today! Anyone wants to have a coffee?")
          .publishedAt(new Date("2023-02-09T15:15:00.000Z"))
          .build(),
      ]);
      followingFixture.givenUserFollows({
        user: "Charlie",
        followedUsers: ["Alice"],
      });

      await fixture.whenUserSeesTheWallOf("Charlie");

      fixture.thenUserShouldSee([
        {
          author: "Charlie",
          text: "I'm in New York today! Anyone wants to have a coffee?",
          publicationTime: "Less than a minute ago",
        },
        {
          author: "Alice",
          text: "I love the weather today",
          publicationTime: "15 minutes ago",
        },
      ]);
    });
  });
});

const createFixture = ({
  messageRepository,
  followersRepository,
}: {
  messageRepository: InMemoryMessageRepository;
  followersRepository: InMemoryFollowersRepository;
}) => {
  let wall: Wall;

  const dateProvider = new StubDateProvider();
  const viewWallUseCase = new ViewWallUseCase(
    messageRepository,
    followersRepository,
    dateProvider
  );
  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    async whenUserSeesTheWallOf(user: string) {
      wall = await viewWallUseCase.handle({ user });
    },
    thenUserShouldSee(expectedWall: Wall) {
      expect(wall).toEqual(expectedWall);
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
