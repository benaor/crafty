import { Message, SerializedMessage } from "../../domain/Message";

export const messageBuilder = ({
  id = "message-id",
  text = "Any text",
  author = "Author",
  publishedAt = new Date("2023-01-19T19:00:00.000Z"),
}: Partial<SerializedMessage> = {}) => {
  const props = { id, author, text, publishedAt };
  return {
    withId(_id: typeof id) {
      return messageBuilder({ ...props, id: _id });
    },
    authoredBy(_author: typeof author) {
      return messageBuilder({ ...props, author: _author });
    },
    withText(_text: typeof text) {
      return messageBuilder({ ...props, text: _text });
    },
    publishedAt(_publishedAt: typeof publishedAt) {
      return messageBuilder({ ...props, publishedAt: _publishedAt });
    },
    build: (): Message =>
      Message.deserialize({
        id: props.id,
        author: props.author,
        text: props.text,
        publishedAt: props.publishedAt,
      }),
  };
};
