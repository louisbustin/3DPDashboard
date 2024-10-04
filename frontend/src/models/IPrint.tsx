export type Status = "Pending" | "Cancelled" | "Complete" | "Active" | "Failed";

export default interface IPrint {
  printerId: string;
  filamentId: string;
  amountUsed: number;
  PrintStatus: Status;
  insertedAt: number;
  updatedAt: number;
  Progress?: number;
  EventType?: number;
  FileName?: string;
  QuickViewUrl?: string;
  Error?: string;
  PrinterId?: string;
  PrinterName?: string;
  ZOffsetMM?: string;
  SnapshotUrl?: string;
  TimeRemaningSec?: number;
  DurationSec?: number;
  PrintId?: string;
  imageUrl?: string;
}

export const getDefaultPrint = (): IPrint => {
  return {
    printerId: "",
    filamentId: "",
    amountUsed: 0,
    PrintStatus: "Pending",
    insertedAt: 0,
    updatedAt: 0,
  };
};
