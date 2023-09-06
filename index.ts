#!/usr/bin/env node
import { Command } from "commander";
import {
  DateProvider,
  PostMessageCommand,
  PostMessageUseCase,
} from "./src/post-message.usecase";
import { FileSystemMessageRepository } from "./src/FileSystemMessageRepository";
import { ViewTimelineUseCase } from "./src/view-timeline.usecase";
import { exit } from "process";

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
          id: (Math.random() * 100000).toString(),
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
