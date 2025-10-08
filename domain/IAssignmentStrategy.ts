import { Assignment, Driver, Job, Vehicle, Weather } from "./models";
export interface IAssignmentStrategy {
  assign(jobs: Job[], drivers: Driver[], vehicles: Vehicle[], weather: Weather, quoteFor: (job: Job, v: Vehicle) => number): Assignment[];
}
