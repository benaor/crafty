import { MessageRepository } from "./MessageRepository";

type TimelineItem = {
  author: string;
  text: string;
  publicationTime: string;
};

export type Timeline = Array<TimelineItem>;

export class ViewTimelineUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}
  async handle({ user }: { user: string }): Promise<Timeline> {
    const messagesOfUser = await this.messageRepository.getAllOfUser(user);

    messagesOfUser.sort(
      (msgA, msgB) => msgB.publishedAt.getTime() - msgA.publishedAt.getTime()
    );

    return [
      {
        author: messagesOfUser[0].author,
        text: messagesOfUser[0].text,
        publicationTime: "1 minute ago",
      },
      {
        author: messagesOfUser[1].author,
        text: messagesOfUser[1].text,
        publicationTime: "3 minutes ago",
      },
    ];
  }
}
