export default interface IFilament {
  id: string;
  name: string;
  brand: string;
  type: string;
  totalWeight: number;
  lowTemp: number;
  highTemp: number;
  lowBedTemp: number;
  highBedTemp: number;
  color: string;
  filamentStatus?: FilamentStatus;
  colorCode?: string;
  reorderThreshold?: number;
  numberOfSpools?: number;
}

export enum FilamentStatus {
  Active,
  Inactive,
}

export const getDefaultFilament = (): IFilament => {
  return {
    id: "",
    name: "",
    type: "",
    brand: "",
    totalWeight: 1000,
    lowTemp: 0,
    highTemp: 0,
    lowBedTemp: 0,
    highBedTemp: 0,
    color: "",
    filamentStatus: FilamentStatus.Active,
    reorderThreshold: 0,
    numberOfSpools: 0,
  };
};
