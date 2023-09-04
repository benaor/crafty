export class StubDateProvider {
  now: Date;

  getNow(): Date {
    return this.now;
  }
}
