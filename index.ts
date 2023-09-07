#!/usr/bin/env node
import { Command } from "commander";
import { exit } from "process";
import { EditMessageUseCase } from "./src/application/usecases/edit-message.usecase";
import {
  PostMessageUseCase,
  PostMessageCommand,
} from "./src/application/usecases/post-message.usecase";
import { ViewTimelineUseCase } from "./src/application/usecases/view-timeline.usecase";
import { DateProvider } from "./src/domain/ports/DateProvider";
import { FileSystemMessageRepository } from "./src/infra/FileSystemMessageRepository";
class RealDateProvider implements DateProvider {
  getNow(): Date {
    return new Date();
  }
}

const dateProvider = new RealDateProvider();
const messageRepository = new FileSystemMessageRepository();
const postMessageUseCase = new PostMessageUseCase(
  messageRepository,
  dateProvider
);
const viewTimelineUseCase = new ViewTimelineUseCase(
  messageRepository,
  dateProvider
);
const editMessageUseCase = new EditMessageUseCase(messageRepository);

const program = new Command();

program
  .version("0.0.1")
  .description("Crafty Social Network")
  .addCommand(
    new Command("post")
      .argument("<user>", "the current user")
      .argument("<message>", "the message to post")
      .action(async (user, message) => {
        const postMessageCommand: PostMessageCommand = {
          id: Math.trunc(Math.random() * 100000).toString(),
          text: message,
          author: user,
        };

        try {
          await postMessageUseCase.handle(postMessageCommand);
          console.log("Message posted!");
          exit(0);
        } catch (error) {
          console.error(error);
          exit(1);
        }
      })
  )
  .addCommand(
    new Command("edit")
      .argument("<message-id>", "The id of message to edit")
      .argument("<message>", "The new message")
      .action(async (messageId, message) => {
        try {
          const timeline = await editMessageUseCase.handle({
            messageId,
            text: message,
          });
          console.log("Message edited!");
          exit(0);
        } catch (error) {
          console.error(error);
          exit(1);
        }
      })
  )
  .addCommand(
    new Command("view")
      .argument("<user>", "The user whose the timeline is displayed")
      .action(async (user) => {
        try {
          const timeline = await viewTimelineUseCase.handle({ user });
          console.table(timeline);
          exit(0);
        } catch (error) {
          console.error(error);
          exit(1);
        }
      })
  );

async function main() {
  await program.parseAsync();
}

main();
