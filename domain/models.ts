export type Driver = { id: string; name: string; licenses: string[]; homeBase: string };
export type Vehicle = { id: string; type: string; capacityKg: number; rangeKm: number; [k: string]: any };
export type Weather = { region: string; conditions: string; tempC: number; windKph: number; alerts: string[] };
export type Job = { id: string; from: string; to: string; distanceKm: number; kg: number; priority: "standard"|"express"; terrain: "urban"|"backcountry" };

export type PricingContext = { job: Job; vehicle: Vehicle; weather: Weather; baseFee: number };
export type PriceEffect = { add?: number; multiply?: number };
export type Quote = { jobId: string; vehicleId: string; price: number; breakdown: { base: number; distance: number; weather: number; priority: number } };

export type Assignment = { jobId: string; driverId: string; vehicleId: string; etaMinutes: number; price: number };
export type DayData = { drivers: Driver[]; vehicles: Vehicle[]; weather: Weather; jobs: Job[] };
