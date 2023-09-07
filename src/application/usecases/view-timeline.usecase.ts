import { Timeline } from "../../domain/Timeline";
import { DateProvider } from "../../domain/ports/DateProvider";
import { MessageRepository } from "../../domain/ports/MessageRepository";

export class ViewTimelineUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private dateProvider: DateProvider
  ) {}
  async handle({ user }: { user: string }): Promise<
    {
      author: string;
      text: string;
      publicationTime: string;
    }[]
  > {
    const messagesOfUser = await this.messageRepository.getAllOfUser(user);

    const timeline = new Timeline(messagesOfUser, this.dateProvider.getNow());

    return timeline.data;
  }
}
