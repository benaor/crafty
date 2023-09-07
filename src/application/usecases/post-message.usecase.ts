import { Message } from "../../domain/Message";
import { MessageRepository } from "../../domain/ports/MessageRepository";
import { DateProvider } from "../../domain/ports/DateProvider";

export type PostMessageCommand = { id: string; text: string; author: string };

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
