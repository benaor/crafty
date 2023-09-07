import {
  Followed,
  FollowersRepository,
} from "../domain/ports/FollowersRepository";

export class FileSystemFollowersRepository implements FollowersRepository {
  saveFollowed(followed: Followed): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getFollowedOf(user: string): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
}
