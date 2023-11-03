import IPrint from "./IPrint";

export default interface IFilament {
  id: string;
  name: string;
  brand: string;
  type: string;
  prints: [IPrint];
  totalWeight: number;
  lowTemp: number;
  highTemp: number;
  lowBedTemp: number;
  highBedTemp: number;
  color: string;
}

export const getDefaultFilament = (): IFilament => {
  return {
    id: "",
    name: "",
    type: "",
    brand: "",
    prints: [] as unknown as [IPrint],
    totalWeight: 1000,
    lowTemp: 0,
    highTemp: 0,
    lowBedTemp: 0,
    highBedTemp: 0,
    color: "",
  };
};
