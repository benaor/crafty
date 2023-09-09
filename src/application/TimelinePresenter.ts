import { Timeline } from "../domain/Timeline";

export abstract class TimelinePresenter {
  abstract show(timeline: Timeline): void;
}
