import { DateProvider } from "../../domain/ports/DateProvider";
import { MessageRepository } from "../../domain/ports/MessageRepository";
import { publicationTime } from "../../utils/publicationTime";

type TimelineItem = {
  author: string;
  text: string;
  publicationTime: string;
};

export type Timeline = Array<TimelineItem>;

export class ViewTimelineUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private dateProvider: DateProvider
  ) {}
  async handle({ user }: { user: string }): Promise<Timeline> {
    const messagesOfUser = await this.messageRepository.getAllOfUser(user);

    messagesOfUser.sort(
      (msgA, msgB) => msgB.publishedAt.getTime() - msgA.publishedAt.getTime()
    );

    return messagesOfUser.map((msg) => ({
      author: msg.author,
      text: msg.text,
      publicationTime: this._publicationTime(msg.publishedAt),
    }));
  }

  private _publicationTime(publishedAt: Date): string {
    const now = this.dateProvider.getNow();
    return publicationTime(now, publishedAt);
  }
}
