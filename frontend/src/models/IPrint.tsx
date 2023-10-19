export default interface IPrint {
  id: string;
  printerId: string;
  amountUsed: number;
}

export const getDefaultPrint = (): IPrint => {
  return { id: "", printerId: "", amountUsed: 0 };
};
