import { Message, MessageText } from "./Message";
import { MessageRepository } from "./MessageRepository";

export type PostMessageCommand = { id: string; text: string; author: string };

export interface DateProvider {
  getNow(): Date;
}

export class PostMessageUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider
  ) {}

  async handle(postMessageCommand: PostMessageCommand) {
    await this.messageRepository.save(
      Message.deserialize({
        id: postMessageCommand.id,
        text: postMessageCommand.text,
        author: postMessageCommand.author,
        publishedAt: this.dateProvider.getNow(),
      })
    );
  }
}
