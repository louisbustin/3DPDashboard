export type Status = "Pending" | "Cancelled" | "Complete" | "Active";

export default interface IPrint {
  id: string;
  filamentId: string;
  amountUsed: number;
  status: Status;
}

export const getDefaultPrint = (): IPrint => {
  return { id: "", filamentId: "", amountUsed: 0, status: "Pending" };
};
