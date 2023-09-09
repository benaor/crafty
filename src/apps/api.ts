import * as httpErrors from "http-errors";
import { PrismaClient } from "@prisma/client";
import Fastify, { FastifyInstance } from "fastify";
import {
  EditMessageCommand,
  EditMessageUseCase,
} from "../application/usecases/edit-message.usecase";
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

class RealDateProvider implements DateProvider {
  getNow(): Date {
    return new Date();
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

const fastify = Fastify({ logger: true });

const routes = async (fastifyInstance: FastifyInstance) => {
  fastifyInstance.post<{ Body: { user: string; message: string } }>(
    "/post",
    {},
    async (request, reply) => {
      const postMessageCommand: PostMessageCommand = {
        id: Math.trunc(Math.random() * 100000).toString(),
        text: request.body.message,
        author: request.body.user,
      };

      try {
        await postMessageUseCase.handle(postMessageCommand);
        reply.send(201);
      } catch (error) {
        reply.send(httpErrors[500](error));
      }
    }
  );

  fastifyInstance.post<{
    Body: { messageId: string; message: string };
  }>("/edit", {}, async (request, reply) => {
    const editMessageCommand: EditMessageCommand = {
      messageId: request.body.messageId,
      text: request.body.message,
    };
    try {
      await editMessageUseCase.handle(editMessageCommand);
      reply.status(200);
    } catch (err) {
      reply.send(httpErrors[500](err));
    }
  });

  fastifyInstance.post<{
    Body: { user: string; followee: string };
  }>("/follow", {}, async (request, reply) => {
    const followUserCommand: FollowUserCommand = {
      user: request.body.user,
      follow: request.body.followee,
    };
    try {
      await followUserUseCase.handle(followUserCommand);
      reply.status(201);
    } catch (err) {
      reply.send(httpErrors[500](err));
    }
  });

  fastifyInstance.get<{
    Querystring: { user: string };
    Reply:
      | { author: string; text: string; publicationTime: string }[]
      | httpErrors.HttpError<500>;
  }>("/view", {}, async (request, reply) => {
    try {
      const timeline = await viewTimelineUseCase.handle({
        user: request.query.user,
      });
      reply.status(200).send(timeline);
    } catch (err) {
      reply.send(httpErrors[500](err));
    }
  });

  fastifyInstance.get<{
    Querystring: { user: string };
    Reply:
      | { author: string; text: string; publicationTime: string }[]
      | httpErrors.HttpError<500>;
  }>("/wall", {}, async (request, reply) => {
    try {
      const wall = await viewWallUseCase.handle({ user: request.query.user });
      reply.status(200).send(wall);
    } catch (err) {
      reply.send(httpErrors[500](err));
    }
  });
};

fastify.register(routes);

fastify.addHook("onClose", async () => {
  await prismaClient.$disconnect();
});

async function main() {
  try {
    await prismaClient.$connect();
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
