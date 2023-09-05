import { inMemoryMessageRepository } from "../InMemoryMessageRepository";
import { Message } from "../Message";
import { StubDateProvider } from "../StubDateProvider";
import { Timeline, ViewTimelineUseCase } from "../view-timeline.usecase";

describe("Feature: Viewing a personnal timeline", () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe("Rule: Messages are shown in reverse chronological order", () => {
    test("Alice can view the 2 messages she published in her timeline", async () => {
      fixture.givenTheFollowingMessagesExist([
        {
          id: "message-1",
          author: "Alice",
          text: "Hello, Alice chating !",
          publishedAt: new Date("2023-02-07T16:28:00.000Z"),
        },
        {
          id: "message-2",
          author: "Bob",
          text: "Hello, I'm Bob !",
          publishedAt: new Date("2023-02-07T16:29:00.000Z"),
        },
        {
          id: "message-3",
          author: "Alice",
          text: "May I as who's chating ?",
          publishedAt: new Date("2023-02-07T16:30:00.000Z"),
        },
        {
          id: "message-4",
          author: "Alice",
          text: "My last message",
          publishedAt: new Date("2023-02-07T16:30:30.000Z"),
        },
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

const createFixture = () => {
  let timeline: Timeline;

  const messageRepository = new inMemoryMessageRepository();
  const dateProvider = new StubDateProvider();
  const viewTimelineUseCase = new ViewTimelineUseCase(
    messageRepository,
    dateProvider
  );
  return {
    givenTheFollowingMessagesExist(messages: Message[]) {
      messageRepository.givenExistingMessages(messages);
    },
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    async whenUserSeesTheTimelineOf(user: string) {
      timeline = await viewTimelineUseCase.handle({ user });
    },
    thenUserShouldSee(expectedTimeline: Timeline) {
      expect(timeline).toEqual(expectedTimeline);
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
