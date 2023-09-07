import { publicationTime } from "../utils/publicationTime";
import { Message } from "./Message";

export class Timeline {
  constructor(
    private readonly messages: Message[],
    private readonly now: Date
  ) {}

  get data() {
    this.messages.sort(
      (msgA, msgB) => msgB.publishedAt.getTime() - msgA.publishedAt.getTime()
    );

    return this.messages.map((message) => ({
      author: message.author,
      text: message.text,
      publicationTime: this.publicationTime(message.publishedAt),
    }));
  }

  private publicationTime = (publishedAt: Date) => {
    return publicationTime(this.now, publishedAt);
  };
}
