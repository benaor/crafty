import { Message } from "./Message";
import { MessageRepository } from "./MessageRepository";

export class inMemoryMessageRepository implements MessageRepository {
  messages = new Map<string, Message>();

  getAllOfUser(user: string): Promise<Message[]> {
    return Promise.resolve(
      [...this.messages.values()].filter((msg) => msg.author === user)
    );
  }

  async save(msg: Message): Promise<void> {
    this._save(msg);
    return Promise.resolve();
  }

  getMessageById = (messageId: string) => {
    return this.messages.get(messageId);
  };

  givenExistingMessages = (messages: Message[]) => {
    messages.forEach(this._save);
  };

  private _save = (msg: Message) => {
    this.messages.set(msg.id, msg);
  };
}
