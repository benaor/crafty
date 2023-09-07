import { EmptyMessageError, MessageTooLongError } from "../../domain/Message";
import { messageBuilder } from "../message.builder";
import { MessagingFixture, createMessagingFixture } from "../messaging.fixture";

describe("Feature: Edit message", () => {
  let fixture: MessagingFixture;
  beforeEach(() => {
    fixture = createMessagingFixture();
  });

  describe("Rule: The edited text should not contain more than 280 characters", () => {
    test("Alice can edit her message to a text inferior to 280 characters", async () => {
      const alicesMessage = messageBuilder()
        .withId("message-id")
        .authoredBy("Alice")
        .withText("Holà, Alice shooting !");

      fixture.givenTheFollowingMessagesExist([alicesMessage.build()]);

      await fixture.whenUserEditsMessage({
        messageId: "message-id",
        text: "Hello, Alice chating !",
      });

      await fixture.thenMessageShouldBe(
        alicesMessage.withText("Hello, Alice chating !").build()
      );
    });

    test("Alice cannot edit her message to a text superior to 280 characters", async () => {
      const messageWith281Characters = `
        Lorem ipsum dolor sit amet,
        onsectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptat`;

      const alicesMessage = messageBuilder()
        .withId("message-id")
        .authoredBy("Alice")
        .withText("Holà, Alice shooting !")
        .build();

      fixture.givenTheFollowingMessagesExist([alicesMessage]);

      await fixture.whenUserEditsMessage({
        messageId: "message-id",
        text: messageWith281Characters,
      });

      await fixture.thenMessageShouldBe(alicesMessage);
      fixture.thenErrorShouldBe(MessageTooLongError);
    });

    test("Alice cannot edit her message to a empty message", async () => {
      const emptyText = ``;

      const alicesMessage = messageBuilder()
        .withId("message-id")
        .authoredBy("Alice")
        .withText("Hi, Alice speaking !")
        .build();

      fixture.givenTheFollowingMessagesExist([alicesMessage]);

      await fixture.whenUserEditsMessage({
        messageId: "message-id",
        text: emptyText,
      });

      await fixture.thenMessageShouldBe(alicesMessage);
      fixture.thenErrorShouldBe(EmptyMessageError);
    });

    test("Alice cannot edit her message to a message which contain only white spaces", async () => {
      const emptyText = `    `;

      const alicesMessage = messageBuilder()
        .withId("message-id")
        .authoredBy("Alice")
        .withText("Hi, Alice speaking !")
        .build();

      fixture.givenTheFollowingMessagesExist([alicesMessage]);

      await fixture.whenUserEditsMessage({
        messageId: "message-id",
        text: emptyText,
      });

      await fixture.thenMessageShouldBe(alicesMessage);
      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});
