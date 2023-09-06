import * as fs from "fs";
import * as path from "path";
import { Message } from "./Message";
import { MessageRepository } from "./MessageRepository";

export class FileSystemMessageRepository implements MessageRepository {
  private messagePath = path.join(__dirname, "message.json");

  getAllOfUser(user: string): Promise<Message[]> {
    const messages = this.getMessages().then((messages) =>
      messages.filter((msg) => msg.author === user)
    );
    return messages;
  }

  getById(messageId: string): Promise<Message> {
    return this.getMessages().then(
      (messages) => messages.find((msg) => msg.id === messageId)!
    );
  }

  async save(msg: Message): Promise<void> {
    const messages = await this.getMessages();
    const existingMessage = messages.findIndex((m) => m.id === msg.id);

    if (existingMessage === -1) {
      messages.push(msg);
    } else {
      messages[existingMessage] = msg;
    }

    return fs.promises.writeFile(this.messagePath, JSON.stringify(messages));
  }

  private async getMessages(): Promise<Message[]> {
    try {
      const data = await fs.promises.readFile(this.messagePath);
      const messages = JSON.parse(data.toString()) as Message[];

      return messages.map((msg) => ({
        id: msg.id,
        text: msg.text,
        author: msg.author,
        publishedAt: new Date(msg.publishedAt),
      }));
    } catch (error) {
      return [];
    }
  }
}
