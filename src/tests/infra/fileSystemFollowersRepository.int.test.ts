import * as path from "path";
import * as fs from "fs";
import { FileSystemFollowersRepository } from "../../infra/FileSystemFollowersRepository";

const testFollowersPath = path.join(__dirname, "testFollowers.json");

describe("fileSystemFollowersRepository", () => {
  beforeEach(async () => {
    fs.promises.writeFile(testFollowersPath, JSON.stringify({}));
  });

  afterEach(async () => {
    fs.promises.unlink(testFollowersPath);
  });

  test("saveFollowed() should save a new followed", async () => {
    const followersRepository = new FileSystemFollowersRepository(
      testFollowersPath
    );

    await fs.promises.writeFile(
      testFollowersPath,
      JSON.stringify({
        Alice: ["Bob"],
        Bob: ["Charlie"],
      })
    );

    await followersRepository.saveFollowed({
      user: "Alice",
      followed: "Charlie",
    });

    const FollowedData = await fs.promises.readFile(testFollowersPath);
    const alicesFollowedJSON = JSON.parse(FollowedData.toString());
    expect(alicesFollowedJSON).toEqual({
      Alice: ["Bob", "Charlie"],
      Bob: ["Charlie"],
    });
  });

  test("saveFollowed() should save a new followed when there was no followed before", async () => {
    const followersRepository = new FileSystemFollowersRepository(
      testFollowersPath
    );

    await fs.promises.writeFile(
      testFollowersPath,
      JSON.stringify({
        Bob: ["Charlie"],
      })
    );

    await followersRepository.saveFollowed({
      user: "Alice",
      followed: "Charlie",
    });

    const FollowedData = await fs.promises.readFile(testFollowersPath);
    const alicesFollowedJSON = JSON.parse(FollowedData.toString());
    expect(alicesFollowedJSON).toEqual({
      Alice: ["Charlie"],
      Bob: ["Charlie"],
    });
  });

  test("getFollowedOf() should return user followed", async () => {
    const followersRepository = new FileSystemFollowersRepository(
      testFollowersPath
    );

    await fs.promises.writeFile(
      testFollowersPath,
      JSON.stringify({
        Alice: ["Bob", "Charlie"],
        Bob: ["Charlie"],
      })
    );

    const [AliceFollowed, BobFollowed] = await Promise.all([
      followersRepository.getFollowedOf("Alice"),
      followersRepository.getFollowedOf("Bob"),
    ]);

    expect(AliceFollowed).toEqual(["Bob", "Charlie"]);
    expect(BobFollowed).toEqual(["Charlie"]);
  });
});
