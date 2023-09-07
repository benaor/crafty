export type Followed = {
  user: string;
  followed: string;
};

export interface FollowersRepository {
  saveFollowed(followed: Followed): Promise<void>;
}
