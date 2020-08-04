import { IPrinterResponce } from "./IPrinterResponce"

export class PendingCall<T extends IPrinterResponce> {
    constructor(commandId : string, accept : (n: T) => any, reject : (n: Error) => any) {

        this.CommandId = commandId;
        this.Accept = accept;
        this.Reject = reject;
    }

    Accept: (n: T) => any;
    Reject: (n: Error) => any;

    public readonly CommandId : string;
}