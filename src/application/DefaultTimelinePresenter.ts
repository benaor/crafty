import { time } from "console";
import { Timeline } from "../domain/Timeline";
import { TimelinePresenter } from "./TimelinePresenter";
import { publicationTime } from "../utils/publicationTime";
import { DateProvider } from "../domain/ports/DateProvider";

export class DefaultTimelinePresenter implements TimelinePresenter {
  constructor(private readonly dateProvider: DateProvider) {}
  show(timeline: Timeline): Array<{
    author: string;
    text: string;
    publicationTime: string;
  }> {
    const message = timeline.data;
    return message.map((msg) => ({
      author: msg.author,
      text: msg.text,
      publicationTime: this.computePublicationTime(msg.publishedAt),
    }));
  }

  private computePublicationTime(publishedAt: Date): string {
    return publicationTime(this.dateProvider.getNow(), publishedAt);
  }
}
