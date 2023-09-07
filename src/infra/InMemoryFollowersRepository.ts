import {
  Followed,
  FollowersRepository,
} from "../domain/ports/FollowersRepository";

export class InMemoryFollowersRepository implements FollowersRepository {
  followedByUser = new Map<string, string[]>();

  async saveFollowed(followed: Followed): Promise<void> {
    this.addFollowed(followed);

    return Promise.resolve();
  }

  givenExistingFollowed = (followedUsers: Followed[]) => {
    followedUsers.forEach(this.addFollowed);
  };

  async getFollowedOf(user: string) {
    return Promise.resolve(this.followedByUser.get(user) ?? []);
  }

  private addFollowed = (followed: Followed) => {
    const existingFollowedUsers = this.followedByUser.get(followed.user) ?? [];
    existingFollowedUsers.push(followed.followed);
    this.followedByUser.set(followed.user, existingFollowedUsers);
  };
}
