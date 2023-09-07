export class MessageTooLongError extends Error {}
export class EmptyMessageError extends Error {}

export class Message {
  constructor(
    private readonly _id: string,
    private _text: MessageText,
    private readonly _author: string,
    private readonly _publishedAt: Date
  ) {}

  get id() {
    return this._id;
  }

  get author() {
    return this._author;
  }

  get publishedAt() {
    return this._publishedAt;
  }

  get text() {
    return this._text.value;
  }

  get serialize() {
    return {
      id: this.id,
      text: this.text,
      author: this.author,
      publishedAt: this.publishedAt,
    };
  }

  editText(text: string) {
    this._text = MessageText.create(text);
  }

  static deserialize(data: Message["serialize"]) {
    return new Message(
      data.id,
      MessageText.create(data.text),
      data.author,
      new Date(data.publishedAt)
    );
  }
}

export type SerializedMessage = Omit<Message, "text"> & {
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
