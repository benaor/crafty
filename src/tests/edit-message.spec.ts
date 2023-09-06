import { messageBuilder } from "./message.builder";
import { MessagingFixture, createMessagingFixture } from "./messaging.fixture";

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

      fixture.thenMessageShouldBe(
        alicesMessage.withText("Hello, Alice chating !").build()
      );
    });
  });
});
