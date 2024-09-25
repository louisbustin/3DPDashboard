export default interface IPrinter {
  id: string;
  name?: string;
  brand?: string;
  type?: string;
  octoEverywhereId?: string;
}

export const getDefaultPrinter = (): IPrinter => {
  return {
    id: "",
    name: "",
    brand: "",
    type: "",
    octoEverywhereId: "",
  };
};
