import { messageBuilder } from "./message.builder";
import { MessagingFixture, createMessagingFixture } from "./messaging.fixture";

describe("Feature: Viewing a personnal timeline", () => {
  let fixture: MessagingFixture;

  beforeEach(() => {
    fixture = createMessagingFixture();
  });

  describe("Rule: Messages are shown in reverse chronological order", () => {
    test("Alice can view the 2 messages she published in her timeline", async () => {
      const alicesMessage = messageBuilder().authoredBy("Alice");
      const bobsMessage = messageBuilder().authoredBy("Bob");

      fixture.givenTheFollowingMessagesExist([
        alicesMessage
          .withId("message-1")
          .withText("Hello, Alice chating !")
          .publishedAt(new Date("2023-02-07T16:28:00.000Z"))
          .build(),

        bobsMessage
          .withId("message-2")
          .withText("Hello, I'm Bob !")
          .publishedAt(new Date("2023-02-07T16:29:00.000Z"))
          .build(),

        alicesMessage
          .withId("message-3")
          .withText("May I as who's chating ?")
          .publishedAt(new Date("2023-02-07T16:30:00.000Z"))
          .build(),

        alicesMessage
          .withId("message-4")
          .withText("My last message")
          .publishedAt(new Date("2023-02-07T16:30:30.000Z"))
          .build(),
      ]);

      fixture.givenNowIs(new Date("2023-02-07T16:31:00.000Z"));

      await fixture.whenUserSeesTheTimelineOf("Alice");

      fixture.thenUserShouldSee([
        {
          author: "Alice",
          text: "My last message",
          publicationTime: "Less than a minute ago",
        },
        {
          author: "Alice",
          text: "May I as who's chating ?",
          publicationTime: "1 minute ago",
        },
        {
          author: "Alice",
          text: "Hello, Alice chating !",
          publicationTime: "3 minutes ago",
        },
      ]);
    });
  });
});
