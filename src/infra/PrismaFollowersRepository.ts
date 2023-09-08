import { PrismaClient } from "@prisma/client";
import {
  Followed,
  FollowersRepository,
} from "../domain/ports/FollowersRepository";

export class PrismaFolloweeRepository implements FollowersRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async saveFollowed(followee: Followed): Promise<void> {
    await this.upsertUser(followee.user);
    await this.upsertUser(followee.followed);
    await this.prisma.user.update({
      where: { name: followee.user },
      data: {
        following: {
          connectOrCreate: [
            {
              where: { name: followee.followed },
              create: { name: followee.followed },
            },
          ],
        },
      },
    });
  }

  async getFollowedOf(user: string): Promise<string[]> {
    const theUser = await this.prisma.user.findFirstOrThrow({
      where: { name: user },
      include: { following: true },
    });

    return theUser.following.map((f) => f.name);
  }

  private async upsertUser(user: string) {
    await this.prisma.user.upsert({
      where: { name: user },
      update: {
        name: user,
      },
      create: {
        name: user,
      },
    });
  }
}
