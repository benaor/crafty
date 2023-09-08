import * as path from "path";
import * as fs from "fs";
import {
  Followed,
  FollowersRepository,
} from "../domain/ports/FollowersRepository";

export class FileSystemFollowersRepository implements FollowersRepository {
  constructor(
    private readonly followedPath = path.join(__dirname, "./followed.json")
  ) {}

  async saveFollowed(followed: Followed): Promise<void> {
    const followeds = await this.getFollowed();
    const actualUserFollowed = followeds[followed.user] ?? [];

    actualUserFollowed.push(followed.followed);
    followeds[followed.user] = actualUserFollowed;

    return fs.promises.writeFile(this.followedPath, JSON.stringify(followeds));
  }

  async getFollowedOf(user: string): Promise<string[]> {
    const followeds = await this.getFollowed();
    return followeds[user] ?? [];
  }

  private async getFollowed(): Promise<Record<string, string[]>> {
    const data = await fs.promises.readFile(this.followedPath);
    return JSON.parse(data.toString()) as { [user: string]: string[] };
  }
}
