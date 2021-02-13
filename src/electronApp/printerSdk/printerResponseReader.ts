import { MachineCommands } from './machineCommands';
import { IPrinterResponse, PrinterStatus, TemperatureResponse, FirmwareVersionResponse, PendingCall, PendingResponse } from './entities';

/**
 * A class for reading responses from the printer.
 */
export class PrinterResponseReader
{
    /**
     * The regex for detecting the start of a response and extracting the command.
     */
    private readonly cmdReceivedRegex = new RegExp('CMD (?<CommandId>[MG][0-9]+) Received\.');

    /**
     * The buffer of packets sent from the printer.
     */
    private buffer = '';

    /**
     * The buffer of full lines sent by the printer.
     */
    private readonly lineBuffer: Array<string>  = new Array<string>();

    /**
     * The buffer of command responses send by the printer.
     */
    private readonly responseBuffer: Array<PendingResponse>  = new Array<PendingResponse>();

    /**
     * All requests made to the printer awaiting a response.
     */
    private readonly pendingCalls: Array<PendingCall<IPrinterResponse>> = new Array<PendingCall<IPrinterResponse>>();

    /*
    * The printer connection.
     */
    private socket: any;

    /**
     * Initializes a new instance of the PrinterResponseReader class.
     */
    constructor(socket: object) {
        this.socket = socket;
        this.socket.on('data', (d: any) => this.HandleData(d.toString()) );
    }

    /**
     * Handle new data from the printer.
     * @param data The data.
     */
    private HandleData(data: string): void {
        let prev = 0;
        let next = 0;

        while ((next = data.indexOf('\n', prev)) > -1) {
            this.buffer += data.substring(prev, next);

            // Found a new line
            this.lineBuffer.push(this.buffer);
            this.TryDrainBuffer();

            this.buffer = '';
            prev = next + 1;
          }

          // No new line is this data, add to the buffer and for a future packet
        this.buffer += data.substring(prev);
    }

    /**
     * Tries to resolve all received lines into a single response object.
     */
    private TryDrainBuffer(): void {
        const mostResentLine = this.lineBuffer[this.lineBuffer.length - 1].trim();
        if (mostResentLine === 'ok' || mostResentLine === 'ok.') {

            // Find a machine command
            const commandId = this.GetCommandId();

            if (commandId != null && commandId.length > 0){
                this.responseBuffer.push(new PendingResponse(commandId, this.GenerateResponse(commandId, this.lineBuffer)));

                this.TryDrainPendingCalls();
            }

            this.lineBuffer.length = 0;
        }
        else if (mostResentLine.endsWith('error')) {

            // Find a machine command
            const commandId = this.GetCommandId();

            // Pull out the error code
            let errorCode = '';
            const errorParts = mostResentLine.split(' ');

            if (errorParts.length === 2)
            {
                errorCode = errorParts[0];
            }

            if (commandId != null && commandId.length > 0){
                // Failed to find a command, the buffer is useless.
                this.responseBuffer.push(new PendingResponse(commandId, null, new Error(errorCode)));

                this.TryDrainPendingCalls();
            }

            this.lineBuffer.length = 0;
        }
    }

    /**
     * Gets the command ID that a given response is for.
     */
    private GetCommandId(): string {
        for (let i = this.lineBuffer.length - 2; i >= 0; --i) {
            const searchLine = this.lineBuffer[i];

            const match = searchLine.match(this.cmdReceivedRegex);
            if (this.cmdReceivedRegex.test(searchLine)) {

                // Pull out the ID that the response is for
                return match.groups['CommandId'];
            }
        }

        return null;
    }

    /**
     * Tries to resolve all response objects to requests and completes their promises.
     */
    private TryDrainPendingCalls(): void {
        for (let i = 0; i < this.responseBuffer.length; ++i){
            for (let a = 0; a < this.pendingCalls.length; ++a){
                const response = this.responseBuffer[i];
                const pendingCall = this.pendingCalls[a];

                if (response.CommandId == pendingCall.CommandId){
                    if (response.Error != null){
                        pendingCall.Reject(response.Error);
                    }
                    else {
                        pendingCall.Accept(response.Result);
                    }

                    this.responseBuffer.splice(i, 1);
                    this.pendingCalls.splice(a, 1);

                    return;
                }
            }
        }
    }

    /**
     * Gets the response for a command from the printer.
     */
    public GerPrinterResponse<T extends IPrinterResponse>(commandId: string): Promise<T>
    {
        const promise = new Promise<T>((a, r) => {
            const pendingCal = new PendingCall(commandId, a, r);
            this.pendingCalls.push(pendingCal);

            this.TryDrainPendingCalls();
        });

        return promise;
    }

    /**
     * Generates a response object from returned data.
     * @param command The command that the response is for.
     * @param data The data in the response.
     */
    private GenerateResponse(command: string, data: Array<string>): IPrinterResponse
    {
        switch (command)
        {
            case MachineCommands.GetEndstopStatus:
                return new PrinterStatus(data);
            case MachineCommands.GetFirmwareVersion:
                return new FirmwareVersionResponse(data);
            case MachineCommands.GetTemperature:
                return new TemperatureResponse(data);
            case MachineCommands.BeginWriteToSdCard:
            case MachineCommands.EndWriteToSdCard:
            case MachineCommands.PrintFileFromSd:
                return null;
            default:
                throw new Error();
        }
    }
}
