import * as fs from "fs";
import * as path from "path";
import { Message } from "./Message";
import { MessageRepository } from "./MessageRepository";

export class FileSystemMessageRepository implements MessageRepository {
  private messagePath = path.join(__dirname, "message.json");

  getAllOfUser(user: string): Promise<Message[]> {
    throw new Error("Method not implemented.");
  }

  async save(msg: Message): Promise<void> {
    const messages = await this.getMessages();
    messages.push(msg);
    return fs.promises.writeFile(this.messagePath, JSON.stringify(messages));
  }

  private async getMessages(): Promise<Message[]> {
    const data = await fs.promises.readFile(this.messagePath);
    const messages = JSON.parse(data.toString()) as Message[];

    return messages.map((msg) => ({
      id: msg.id,
      text: msg.text,
      author: msg.author,
      publishedAt: new Date(msg.publishedAt),
    }));
  }
}
