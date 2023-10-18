export default interface IFilament {
  id: string;
  name?: string;
  brand?: string;
  type?: string;
}

export const getDefaultFilament = (): IFilament => {
  return { id: "", name: "", type: "", brand: "" };
};
