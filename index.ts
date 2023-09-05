#!/usr/bin/env node
import { Command } from "commander";
import {
  DateProvider,
  PostMessageCommand,
  PostMessageUseCase,
} from "./src/post-message.usecase";
import { FileSystemMessageRepository } from "./src/FileSystemMessageRepository";

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
          id: "message-id",
          text: message,
          author: user,
        };

        try {
          await postMessageUseCase.handle(postMessageCommand);
          console.log("Message posted!");
          process.exit(0);
        } catch (error) {
          console.error(error);
          process.exit(1);
        }
      })
  );

async function main() {
  await program.parseAsync();
}

main();
