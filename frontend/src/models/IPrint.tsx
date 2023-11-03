export type Status = "Pending" | "Cancelled" | "Complete" | "Active";

export default interface IPrint {
  id: string;
  printerId: string;
  amountUsed: number;
  status: Status;
}

export const getDefaultPrint = (): IPrint => {
  return { id: "", printerId: "", amountUsed: 0, status: "Pending" };
};
