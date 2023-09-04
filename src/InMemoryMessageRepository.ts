import { Message, MessageRepository } from "./post-message.usecase";

export class inMemoryMessageRepository implements MessageRepository {
  message: Message;

  save(msg: Message): void {
    this.message = msg;
  }
}
