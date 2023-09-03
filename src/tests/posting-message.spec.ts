import {
  EmptyMessageError,
  Message,
  MessageRepository,
  MessageTooLongError,
  PostMessageCommand,
  PostMessageUseCase,
} from "../post-message.usecase";

describe("Feature: Posting a message", () => {
  describe("Rule: A message can contain a maximum of 280 characters", () => {
    test("Alice can post a message on her timeline", () => {
      GivenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      whenUserPostsAMessage({
        id: "message-id",
        text: "Hello world",
        author: "Alice",
      });

      thenPostedMessageShouldBe({
        id: "message-id",
        text: "Hello world",
        author: "Alice",
        publishedAt: new Date("2023-01-19T19:00:00.000Z"),
      });
    });

    test("Alice cannot post a message with more than 280 characters", () => {
      const messageWith281Characters = `
        Lorem ipsum dolor sit amet,
        onsectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptat`;

      GivenNowIs(new Date("2023-01-19T19:00:00.000Z"));
      whenUserPostsAMessage({
        id: "message-id",
        text: messageWith281Characters,
        author: "Alice",
      });
      thenErrorShouldBe(MessageTooLongError);
    });
  });

  describe("Rule: A message musn't be empty", () => {
    test("Alice cannot post a message with an empty text", () => {
      const emptyText = ``;

      GivenNowIs(new Date("2023-01-19T19:00:00.000Z"));
      whenUserPostsAMessage({
        id: "message-id",
        text: emptyText,
        author: "Alice",
      });
      thenErrorShouldBe(EmptyMessageError);
    });
  });
});

let message: Message;
let thrownError: Error;

class inMemoryMessageRepository implements MessageRepository {
  save(msg: Message): void {
    message = msg;
  }
}

class StubDateProvider {
  now: Date;

  getNow(): Date {
    return this.now;
  }
}

const messageRepository = new inMemoryMessageRepository();
const dateProvider = new StubDateProvider();

const postMessageUseCase = new PostMessageUseCase(
  messageRepository,
  dateProvider
);

function GivenNowIs(_now: Date) {
  dateProvider.now = _now;
}

function whenUserPostsAMessage(postMessageCommand: PostMessageCommand) {
  try {
    postMessageUseCase.handle(postMessageCommand);
  } catch (error) {
    thrownError = error;
  }
}

function thenPostedMessageShouldBe(expectedMessage: Message) {
  expect(expectedMessage).toEqual(message);
}

function thenErrorShouldBe(expectedErrorClass: new () => Error) {
  expect(thrownError).toBeInstanceOf(expectedErrorClass);
}
