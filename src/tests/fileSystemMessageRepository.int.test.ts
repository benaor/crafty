import * as path from "path";
import * as fs from "fs";
import { messageBuilder } from "./message.builder";
import { FileSystemMessageRepository } from "../infra/FileSystemMessageRepository";

const testMessagesPath = path.join(__dirname, "testMessage.json");

describe("fileSystemMessageRepository", () => {
  afterEach(async () => {
    await fs.promises.unlink(testMessagesPath);
  });

  test("Save() can save a message in the fileSystem", async () => {
    const messageRepository = new FileSystemMessageRepository(testMessagesPath);
    const message = messageBuilder()
      .withId("m1")
      .authoredBy("Alice")
      .publishedAt(new Date("2021-01-01T00:00:00.000Z"))
      .withText("Hello world!")
      .build();

    await messageRepository.save(message);

    const messageData = await fs.promises.readFile(testMessagesPath);
    const messageJson = JSON.parse(messageData.toString());

    expect(messageJson).toEqual([
      {
        id: "m1",
        author: "Alice",
        text: "Hello world!",
        publishedAt: "2021-01-01T00:00:00.000Z",
      },
    ]);
  });

  test("Save() can update an existing message in the fileSystem", async () => {
    const messageRepository = new FileSystemMessageRepository(testMessagesPath);

    await fs.promises.writeFile(
      testMessagesPath,
      JSON.stringify([
        {
          id: "m1",
          author: "Alice",
          text: "Hello world!",
          publishedAt: "2021-01-01T00:00:00.000Z",
        },
      ])
    );

    const message = messageBuilder()
      .withId("m1")
      .authoredBy("Alice")
      .publishedAt(new Date("2021-01-01T00:00:00.000Z"))
      .withText("Updated!")
      .build();

    await messageRepository.save(message);

    const messageData = await fs.promises.readFile(testMessagesPath);
    const messageJson = JSON.parse(messageData.toString());

    expect(messageJson).toEqual([
      {
        id: "m1",
        author: "Alice",
        text: "Updated!",
        publishedAt: "2021-01-01T00:00:00.000Z",
      },
    ]);
  });
  test("GetbyId() returns a message by its id", async () => {
    const messageRepository = new FileSystemMessageRepository(testMessagesPath);

    await fs.promises.writeFile(
      testMessagesPath,
      JSON.stringify([
        {
          id: "m1",
          author: "Alice",
          text: "Hello world!",
          publishedAt: "2021-01-01T00:00:00.000Z",
        },
        {
          id: "m2",
          author: "Bob",
          text: "Holà touta los mondos!",
          publishedAt: "2021-01-01T01:00:00.000Z",
        },
      ])
    );

    const expectedMessage = messageBuilder()
      .withId("m2")
      .authoredBy("Bob")
      .publishedAt(new Date("2021-01-01T01:00:00.000Z"))
      .withText("Holà touta los mondos!")
      .build();

    const bobMessage = await messageRepository.getById("m2");

    expect(bobMessage).toEqual(expectedMessage);
  });

  test("GetAllOfUser returns all the messages of specific user", async () => {
    const messageRepository = new FileSystemMessageRepository(testMessagesPath);

    await fs.promises.writeFile(
      testMessagesPath,
      JSON.stringify([
        {
          id: "m1",
          author: "Alice",
          text: "Hello world!",
          publishedAt: "2021-01-01T00:00:00.000Z",
        },
        {
          id: "m2",
          author: "Bob",
          text: "Holà touta los mondos!",
          publishedAt: "2021-01-01T01:00:00.000Z",
        },
        {
          id: "m3",
          author: "Bob",
          text: "Guten Tag!",
          publishedAt: "2021-01-01T02:00:00.000Z",
        },
      ])
    );

    const expectedMessages = expect.arrayContaining([
      messageBuilder()
        .withId("m2")
        .authoredBy("Bob")
        .publishedAt(new Date("2021-01-01T01:00:00.000Z"))
        .withText("Holà touta los mondos!")
        .build(),

      messageBuilder()
        .withId("m3")
        .authoredBy("Bob")
        .publishedAt(new Date("2021-01-01T02:00:00.000Z"))
        .withText("Guten Tag!")
        .build(),
    ]);

    const bobMessage = await messageRepository.getAllOfUser("Bob");

    expect(bobMessage).toHaveLength(2);
    expect(bobMessage).toEqual(expectedMessages);
  });
});
