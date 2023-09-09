import { FollowersRepository } from "../../domain/ports/FollowersRepository";
import { MessageRepository } from "../../domain/ports/MessageRepository";
import { DateProvider } from "../../domain/ports/DateProvider";
import { Timeline } from "../../domain/Timeline";
import { TimelinePresenter } from "../TimelinePresenter";

export type Wall = {
  author: string;
  text: string;
  publicationTime: string;
}[];

export class ViewWallUseCase {
  constructor(
    private messageRepository: MessageRepository,
    private followersRepository: FollowersRepository,
    private dateProvider: DateProvider
  ) {}

  async handle(
    { user }: { user: string },
    timelinePresenter: TimelinePresenter
  ): Promise<void> {
    const followees = await this.followersRepository.getFollowedOf(user);

    const users = [user, ...followees];
    const messages = (
      await Promise.all(
        users.map((user) => this.messageRepository.getAllOfUser(user))
      )
    ).flat();

    const timeline = new Timeline(messages);

    timelinePresenter.show(timeline);
  }
}
