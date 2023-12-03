export type Status = "Pending" | "Cancelled" | "Complete" | "Active" | "Failed";

export default interface IPrint {
  id: string;
  filamentId: string;
  amountUsed: number;
  status: Status;
  insertedAt: number;
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
}

export const getDefaultPrint = (): IPrint => {
  return {
    id: "",
    filamentId: "",
    amountUsed: 0,
    status: "Pending",
    insertedAt: 0,
  };
};
