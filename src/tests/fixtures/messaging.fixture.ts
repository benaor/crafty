import { Message } from "../../domain/Message";
import {
  EditMessageUseCase,
  EditMessageCommand,
} from "../../application/usecases/edit-message.usecase";
import {
  PostMessageUseCase,
  PostMessageCommand,
} from "../../application/usecases/post-message.usecase";
import { ViewTimelineUseCase } from "../../application/usecases/view-timeline.usecase";
import { InMemoryMessageRepository } from "../../infra/InMemoryMessageRepository";
import { StubDateProvider } from "../../infra/StubDateProvider";
import { Timeline } from "../../domain/Timeline";

export const createMessagingFixture = () => {
  let thrownError: Error;
  let timeline: {
    author: string;
    text: string;
    publicationTime: string;
  }[];

  const messageRepository = new InMemoryMessageRepository();
  const dateProvider = new StubDateProvider();
  const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
  );
  const viewTimelineUseCase = new ViewTimelineUseCase(
    messageRepository,
    dateProvider
  );
  const editMessageUseCase = new EditMessageUseCase(messageRepository);

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
    whenUserEditsMessage: async (editMessageCommand: EditMessageCommand) => {
      try {
        await editMessageUseCase.handle(editMessageCommand);
      } catch (error) {
        thrownError = error;
      }
    },
    thenMessageShouldBe: async (expectedMessage: Message) => {
      const message = await messageRepository.getById(expectedMessage.id);
      expect(message).toEqual(expectedMessage);
    },
    thenUserShouldSee: (
      expectedTimeline: {
        author: string;
        text: string;
        publicationTime: string;
      }[]
    ) => {
      expect(timeline).toEqual(expectedTimeline);
    },
    thenErrorShouldBe: (expectedErrorClass: new () => Error) => {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
    messageRepository,
  };
};

export type MessagingFixture = ReturnType<typeof createMessagingFixture>;
