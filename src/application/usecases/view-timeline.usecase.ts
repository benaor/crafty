import { time } from "console";
import { Timeline } from "../../domain/Timeline";
import { DateProvider } from "../../domain/ports/DateProvider";
import { MessageRepository } from "../../domain/ports/MessageRepository";
import { TimelinePresenter } from "../TimelinePresenter";

export class ViewTimelineUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private dateProvider: DateProvider
  ) {}
  async handle(
    { user }: { user: string },
    timelinePresenter: TimelinePresenter
  ): Promise<void> {
    const messagesOfUser = await this.messageRepository.getAllOfUser(user);

    const timeline = new Timeline(messagesOfUser);

    return timelinePresenter.show(timeline);
  }
}
