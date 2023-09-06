import { MessageRepository } from "./MessageRepository";
import { MessageText } from "./Message";

export type EditMessageCommand = {
  messageId: string;
  text: string;
};

export class EditMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async handle(editMessageCommand: EditMessageCommand) {
    const text = MessageText.create(editMessageCommand.text);

    const message = await this.messageRepository.getById(
      editMessageCommand.messageId
    );

    const editedMessage = { ...message, text };

    await this.messageRepository.save(editedMessage);
  }
}
