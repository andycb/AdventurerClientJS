import { IPrinterResponse } from './iPrinterResponse';

/**
 * A response from the printer that has not yet been resolved to a request.
 */
export class PendingResponse{
    /**
     * Gets the command ID the response is for (ex. M115).
     */
    public CommandId: string;

    /**
     * Gets the result object if request resulted in success.
     */
    public Result: IPrinterResponse;

    /**
     * Gets the result object if request resulted in failure.
     */
    public Error: Error;

    /**
     * Initializes a new instance of the RendingResponse class.
     * @param commandId The command ID the response is for (ex. M115).
     * @param result The result (or null if unsuccessful).
     * @param error An error that was returned (or null if success).
     */
    constructor(commandId: string, result: IPrinterResponse, error: Error = null){
        this.CommandId = commandId;
        this.Result = result;
        this.Error = error;
    }
}
