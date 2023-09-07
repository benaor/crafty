export class MessageTooLongError extends Error {}
export class EmptyMessageError extends Error {}

export type Message = {
  id: string;
  text: MessageText;
  author: string;
  publishedAt: Date;
};

export type PrimitiveMessage = Omit<Message, "text"> & {
  text: string;
};

export class MessageText {
  private constructor(readonly value: string) {}

  static create(text: string): MessageText {
    if (text.trim().length === 0) throw new EmptyMessageError();
    if (text.length > 280) throw new MessageTooLongError();
    return new MessageText(text);
  }
}
