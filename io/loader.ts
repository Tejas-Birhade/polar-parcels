import fs from 'fs';
import path from 'path';
import { DayData, Driver, Vehicle, Weather, Job } from '../domain/models';

function readJson(filePath: string) {
  const raw = fs.readFileSync(filePath);
  // strip UTF-8 BOM and trim
  const text = raw.toString('utf8').replace(/^\uFEFF/, '').trim();
  return JSON.parse(text);
}

export function loadDay(dataDir = 'data'): DayData {
  const p = (f: string) => path.join(dataDir, f);
  const drivers: Driver[] = readJson(p('drivers.json')).drivers;
  const vehicles: Vehicle[] = readJson(p('vehicles.json')).vehicles;
  const weather: Weather = readJson(p('weather.json'));
  const jobs: Job[] = readJson(p('jobs.json')).jobs;
  return { drivers, vehicles, weather, jobs };
}
