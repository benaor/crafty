import { inMemoryMessageRepository } from "../InMemoryMessageRepository";
import { Message } from "../Message";
import { StubDateProvider } from "../StubDateProvider";
import {
  EmptyMessageError,
  MessageTooLongError,
  PostMessageCommand,
  PostMessageUseCase,
} from "../post-message.usecase";

describe("Feature: Posting a message", () => {
  let fixture: Fixture;
  beforeEach(() => {
    fixture = createFixture();
  });

  describe("Rule: A message can contain a maximum of 280 characters", () => {
    test("Alice can post a message on her timeline", async () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      await fixture.whenUserPostsAMessage({
        id: "message-id",
        text: "Hello world",
        author: "Alice",
      });

      fixture.thenPostedMessageShouldBe({
        id: "message-id",
        text: "Hello world",
        author: "Alice",
        publishedAt: new Date("2023-01-19T19:00:00.000Z"),
      });
    });

    test("Alice cannot post a message with more than 280 characters", async () => {
      const messageWith281Characters = `
        Lorem ipsum dolor sit amet,
        onsectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptat`;

      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
      await fixture.whenUserPostsAMessage({
        id: "message-id",
        text: messageWith281Characters,
        author: "Alice",
      });
      fixture.thenErrorShouldBe(MessageTooLongError);
    });
  });

  describe("Rule: A message musn't be empty", () => {
    test("Alice cannot post a message with an empty text", async () => {
      const emptyText = ``;

      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
      await fixture.whenUserPostsAMessage({
        id: "message-id",
        text: emptyText,
        author: "Alice",
      });
      fixture.thenErrorShouldBe(EmptyMessageError);
    });

    test("Alice cannot post a message withonly white spaces", async () => {
      const textWithOnlySpaces = `      `;

      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
      await fixture.whenUserPostsAMessage({
        id: "message-id",
        text: textWithOnlySpaces,
        author: "Alice",
      });
      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});

const createFixture = () => {
  let thrownError: Error;

  const messageRepository = new inMemoryMessageRepository();
  const dateProvider = new StubDateProvider();
  const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
  );

  return {
    givenNowIs: (now: Date) => {
      dateProvider.now = now;
    },
    whenUserPostsAMessage: async (postMessageCommand: PostMessageCommand) => {
      try {
        await postMessageUseCase.handle(postMessageCommand);
      } catch (error) {
        thrownError = error;
      }
    },
    thenPostedMessageShouldBe: (expectedMessage: Message) => {
      expect(expectedMessage).toEqual(
        messageRepository.getMessageById(expectedMessage.id)
      );
    },
    thenErrorShouldBe: (expectedErrorClass: new () => Error) => {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
