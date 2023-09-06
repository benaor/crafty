import { inMemoryMessageRepository } from "../InMemoryMessageRepository";
import { Message } from "../Message";
import { StubDateProvider } from "../StubDateProvider";
import {
  PostMessageUseCase,
  PostMessageCommand,
} from "../post-message.usecase";
import { Timeline, ViewTimelineUseCase } from "../view-timeline.usecase";

export const createMessagingFixture = () => {
  let thrownError: Error;
  let timeline: Timeline;

  const messageRepository = new inMemoryMessageRepository();
  const dateProvider = new StubDateProvider();
  const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
  );
  const viewTimelineUseCase = new ViewTimelineUseCase(
    messageRepository,
    dateProvider
  );

  return {
    givenNowIs: (now: Date) => {
      dateProvider.now = now;
    },
    givenTheFollowingMessagesExist: (messages: Message[]) => {
      messageRepository.givenExistingMessages(messages);
    },
    whenUserPostsAMessage: async (postMessageCommand: PostMessageCommand) => {
      try {
        await postMessageUseCase.handle(postMessageCommand);
      } catch (error) {
        thrownError = error;
      }
    },
    whenUserSeesTheTimelineOf: async (user: string) => {
      timeline = await viewTimelineUseCase.handle({ user });
    },
    whenUserEditsMessage: async (editMessageCommand: EditMessageCommand) => {},
    thenMessageShouldBe: (expectedMessage: Message) => {
      expect(expectedMessage).toEqual(
        messageRepository.getMessageById(expectedMessage.id)
      );
    },
    thenUserShouldSee: (expectedTimeline: Timeline) => {
      expect(timeline).toEqual(expectedTimeline);
    },
    thenErrorShouldBe: (expectedErrorClass: new () => Error) => {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
  };
};

export type MessagingFixture = ReturnType<typeof createMessagingFixture>;

type EditMessageCommand = {
  messageId: string;
  text: string;
};
