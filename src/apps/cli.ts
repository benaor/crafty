#!/usr/bin/env node
import { Command } from "commander";
import { exit } from "process";
import { EditMessageUseCase } from "../application/usecases/edit-message.usecase";
import {
  FollowUserUseCase,
  FollowUserCommand,
} from "../application/usecases/follow-user.usecase";
import {
  PostMessageUseCase,
  PostMessageCommand,
} from "../application/usecases/post-message.usecase";
import { ViewTimelineUseCase } from "../application/usecases/view-timeline.usecase";
import { ViewWallUseCase } from "../application/usecases/view-wall.usecase";
import { DateProvider } from "../domain/ports/DateProvider";
import { PrismaFolloweeRepository } from "../infra/PrismaFollowersRepository";
import { PrismaMessageRepository } from "../infra/PrismaMessageRepository";
import { PrismaClient } from "@prisma/client";
import { DefaultTimelinePresenter } from "../application/DefaultTimelinePresenter";
import { TimelinePresenter } from "../application/TimelinePresenter";
import { Timeline } from "../domain/Timeline";

class RealDateProvider implements DateProvider {
  getNow(): Date {
    return new Date();
  }
}

class CliTimelinePresenter implements TimelinePresenter {
  constructor(
    private readonly defaultTimelinePresenter: DefaultTimelinePresenter
  ) {}
  show(timeline: Timeline): void {
    console.table(this.defaultTimelinePresenter.show(timeline));
  }
}

const prismaClient = new PrismaClient();

const dateProvider = new RealDateProvider();
const messageRepository = new PrismaMessageRepository(prismaClient);
const followersRepository = new PrismaFolloweeRepository(prismaClient);
const postMessageUseCase = new PostMessageUseCase(
  messageRepository,
  dateProvider
);
const viewTimelineUseCase = new ViewTimelineUseCase(
  messageRepository,
  dateProvider
);
const viewWallUseCase = new ViewWallUseCase(
  messageRepository,
  followersRepository,
  dateProvider
);
const followUserUseCase = new FollowUserUseCase(followersRepository);
const editMessageUseCase = new EditMessageUseCase(messageRepository);
const defaultTimelinePresenter = new DefaultTimelinePresenter(dateProvider);
const timelinePresenter = new CliTimelinePresenter(defaultTimelinePresenter);

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
    new Command("follow")
      .argument("<user>", "The current user")
      .argument("<user-to-follow>", "The user that user wants to follow")
      .action(async (user, userToFollow) => {
        try {
          const followUserCommand: FollowUserCommand = {
            user,
            follow: userToFollow,
          };
          await followUserUseCase.handle(followUserCommand);
          console.log(`${user} is now following ${userToFollow}!`);
          exit(0);
        } catch (error) {
          console.error(error);
          exit(1);
        }
      })
  )
  .addCommand(
    new Command("wall")
      .argument("<user>", "The user whose the wall is displayed")
      .action(async (user) => {
        try {
          await viewWallUseCase.handle({ user }, timelinePresenter);
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
          await viewTimelineUseCase.handle({ user }, timelinePresenter);
          exit(0);
        } catch (error) {
          console.error(error);
          exit(1);
        }
      })
  );

async function main() {
  await prismaClient.$connect();
  await program.parseAsync();
  await prismaClient.$disconnect();
}

main();
