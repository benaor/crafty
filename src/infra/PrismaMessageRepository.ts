import { PrismaClient } from "@prisma/client";
import { Message } from "../domain/Message";
import { MessageRepository } from "../domain/ports/MessageRepository";

export class PrismaMessageRepository implements MessageRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(message: Message): Promise<void> {
    const { id, author, text, publishedAt } = message.serialize;
    await this.prisma.user.upsert({
      where: { name: author },
      update: { name: author },
      create: { name: author },
    });

    await this.prisma.message.upsert({
      where: { id: id },
      update: {
        id: id,
        text: text,
        authorId: author,
        publishedAt: publishedAt,
      },
      create: {
        id: id,
        text: text,
        authorId: author,
        publishedAt: publishedAt,
      },
    });
  }

  async getById(messageId: string): Promise<Message> {
    const { id, authorId, publishedAt, text } =
      await this.prisma.message.findFirstOrThrow({
        where: { id: messageId },
      });

    return Message.deserialize({
      id: id,
      text: text,
      publishedAt: publishedAt,
      author: authorId,
    });
  }

  async getAllOfUser(user: string): Promise<Message[]> {
    const data = await this.prisma.message.findMany({
      where: { authorId: user },
    });

    return data.map(({ id, text, publishedAt, authorId }) =>
      Message.deserialize({
        id: id,
        text: text,
        publishedAt: publishedAt,
        author: authorId,
      })
    );
  }
}
