import locationsData from "./dz-wilayas.json";

export type Wilaya = {
  state: string;
  stateCode: string;
  cities: { name: string }[];
};

export const locations: Wilaya[] = locationsData as Wilaya[];

export function getWilayaNames(): string[] {
  return locations.map((w) => w.state);
}

export function getCitiesByWilaya(wilayaName: string): string[] {
  const wilaya = locations.find((w) => w.state === wilayaName);
  return wilaya ? wilaya.cities.map((c) => c.name) : [];
}

export function getWilayaCode(wilayaName: string): string {
  const wilaya = locations.find((w) => w.state === wilayaName);
  return wilaya ? wilaya.stateCode : "";
}

export function formatLocation(wilayaName: string, cityName: string): string {
  return `${wilayaName} — ${cityName}`;
}
