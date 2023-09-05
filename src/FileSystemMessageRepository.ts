import * as fs from "fs";
import * as path from "path";
import { Message } from "./Message";
import { MessageRepository } from "./MessageRepository";

export class FileSystemMessageRepository implements MessageRepository {
  getAllOfUser(user: string): Promise<Message[]> {
    throw new Error("Method not implemented.");
  }

  async save(msg: Message): Promise<void> {
    return fs.promises.writeFile(
      path.join(__dirname, "message.json"),
      JSON.stringify(msg)
    );
  }
}
