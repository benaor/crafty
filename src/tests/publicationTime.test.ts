import { publicationTime } from "../publicationTime";

describe("PublicationTime", () => {
  it("Should return 'Less than a minute ago' when the message was published less than a minute ago", async () => {
    const now = new Date("2023-02-07T16:31:00.000Z");
    const publishedAt = new Date("2023-02-07T16:30:30.000Z");

    const text = publicationTime(now, publishedAt);
    expect(text).toEqual("Less than a minute ago");
  });

  it("Should return '1 minute ago' when the message was published exactly 1 minute ago", async () => {
    const now = new Date("2023-02-07T16:31:00.000Z");
    const publishedAt = new Date("2023-02-07T16:30:00.000Z");

    const text = publicationTime(now, publishedAt);
    expect(text).toEqual("1 minute ago");
  });

  it("Should return '1 minute ago' when the message was published under 2 minutes ago", async () => {
    const now = new Date("2023-02-07T16:31:59.000Z");
    const publishedAt = new Date("2023-02-07T16:30:00.000Z");

    const text = publicationTime(now, publishedAt);
    expect(text).toEqual("1 minute ago");
  });

  it.each`
    _now                          | _publishedAt                  | _expected
    ${"2023-02-07T16:32:00.000Z"} | ${"2023-02-07T16:30:00.000Z"} | ${"2 minutes ago"}
    ${"2023-02-07T16:33:00.000Z"} | ${"2023-02-07T16:30:00.000Z"} | ${"3 minutes ago"}
    ${"2023-02-07T16:40:59.000Z"} | ${"2023-02-07T16:30:00.000Z"} | ${"10 minutes ago"}
    ${"2023-02-07T17:20:00.000Z"} | ${"2023-02-07T16:30:00.000Z"} | ${"50 minutes ago"}
    ${"2023-02-07T17:25:30.000Z"} | ${"2023-02-07T16:30:00.000Z"} | ${"55 minutes ago"}
  `(
    "Should return 'X minute ago' when the message was published between X minutes ago and X minutes 59 ago",
    async ({ _now, _publishedAt, _expected }) => {
      const now = new Date(_now);
      const publishedAt = new Date(_publishedAt);

      const text = publicationTime(now, publishedAt);
      expect(text).toEqual(_expected);
    }
  );
});
