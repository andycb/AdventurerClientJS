import { IPrinterResponse } from './iPrinterResponse';

/**
 * A request that has been sent to the printer and is awaiting a response.
 */
export class PendingCall<T extends IPrinterResponse> {
    /**
     * Gets a function to invoke when a response is received
     */
    public Accept: (n: T) => any;

    /**
     * Gets a function to invoke when a response an error received.
     */
    public Reject: (n: Error) => any;

    /**
     * Gets the ID of the command that was sent to the printer (ex. M115)
     */
    public readonly CommandId: string;

    /**
     * Initializes a new instance of the PendingCall class.
     * @param commandId The ID of the command that was sent to the printer (ex. M115)
     * @param accept A function to invoke when a response is received.
     * @param reject A function to invoke when a response an error received.
     */
    constructor(commandId: string, accept: (n: T) => any, reject: (n: Error) => any) {

        this.CommandId = commandId;
        this.Accept = accept;
        this.Reject = reject;
    }
}
