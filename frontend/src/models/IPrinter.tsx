import IPrint from "./IPrint";

export default interface IPrinter {
  id: string;
  name?: string;
  brand?: string;
  type?: string;
  prints: [IPrint];
  octoEverywhereId?: string;
}

export const getDefaultPrinter = (): IPrinter => {
  return {
    id: "",
    name: "",
    brand: "",
    type: "",
    prints: [] as unknown as [IPrint],
    octoEverywhereId: "",
  };
};
