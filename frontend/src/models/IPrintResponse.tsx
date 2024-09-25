import IPrint from "./IPrint";

export interface IPrintLastEvaluatedKey {
    id: string;
    PrinterId: string;
}

export default interface IPrintResponse {
    LastEvaluatedKey: IPrintLastEvaluatedKey;
    data: IPrint[];
}