import { MachineCommands } from "./MachineCommands"
import { IPrinterResponce } from "./Entities/IPrinterResponce"
import { PrinterStatus } from "./Entities/PrinterStatus"
import { TemperatureResponse } from "./Entities/TemperatureResponse"
import { FirmwareVersionResponse } from "./Entities/FirmwareVersionResponse"
import { PendingCall } from "./Entities/PendingCall"
import { RendingResponce as PendingResponce } from "./Entities/PendingResponce"

/// <summary>
/// A class for reading responces from the printer.
/// </summary>
export class PrinterResponseReader
{
    /// <summary>
    /// The stream reader
    /// </summary>
    //private readonly StreamReader streamReader;
    /// <summary>
    /// The regex for detecting the start of a response and extracting the command.
    /// </summary>
    private readonly cmdReceivedRegex = new RegExp("CMD (?<CommandId>[MG][0-9]+) Received\.");
    
    /// <summary>
    /// Value indicating if the class has been disposed
    /// </summary>
    private isDisposed = false;

    private readonly lineBuffer : Array<string>  = new Array<string>();
    private readonly responceBuffer : Array<PendingResponce>  = new Array<PendingResponce>();
    private readonly pendingCalls : Array<PendingCall<IPrinterResponce>> = new Array<PendingCall<IPrinterResponce>>();

    private socket : any;

    /// <summary>
    /// Initializes a new insrance of the PrinterResponseReader class.
    /// </summary>
    constructor(socket : object)
    {
        this.socket = socket;
        this.socket.on('data', (d : any) => this.HandleData(d.toString()) );
    }

    private buffer : string;

    private HandleData(data : string) {
        var prev = 0, next;
        
          while ((next = data.indexOf('\n', prev)) > -1) {
            this.buffer += data.substring(prev, next);
        
            // Found a new line
            this.lineBuffer.push(this.buffer);
            console.log(">>>" + this.buffer);
            this.TryDrainBuffer();
        
            this.buffer = '';
            prev = next + 1;
          }

          // No new line is this data, add to the buffer and for a future packet
          this.buffer += data.substring(prev);
    }

    private TryDrainBuffer() {
        var mostResentLine = this.lineBuffer[this.lineBuffer.length -1].trim();
        if (mostResentLine == "ok" || mostResentLine == "ok.") {
            
            // Find a machine command
            var commandId = this.GetCommandId();

            if (commandId.length > 0){
                this.responceBuffer.push(new PendingResponce(commandId, this.GenerateResponce(commandId, this.lineBuffer)));

                this.TryDrainPendingCalls();
            }

            this.lineBuffer.length = 0;
        }
        else if (mostResentLine.endsWith("error")) {

            // Find a machine command
            var commandId = this.GetCommandId();

            // Pull out the error code
            var errorCode = "";
            var errorParts = mostResentLine.split(' ');

            if (errorParts.length == 2)
            {
                errorCode = errorParts[0];
            }

            if (commandId.length > 0){
                // Failed to find a command, the buffer is useless.
                this.responceBuffer.push(new PendingResponce(commandId, null, new Error(errorCode)));

                this.TryDrainPendingCalls();
            }

            this.lineBuffer.length = 0;
        } 
    }

    private GetCommandId() : string{
        for (var i = this.lineBuffer.length -2; i >= 0; --i) {
            var searchLine = this.lineBuffer[i];

            var match = searchLine.match(this.cmdReceivedRegex);
            if (this.cmdReceivedRegex.test(searchLine)) {

                // Pull out the ID that the response is for
                return match.groups["CommandId"];
            }
        } 

        return null;
    }

    private TryDrainPendingCalls(){
        for (var i = 0; i < this.responceBuffer.length; ++i){
            for (var a = 0; a < this.pendingCalls.length; ++a){
                var response = this.responceBuffer[i];
                var pendingCall = this.pendingCalls[a];

                if (response.CommandId == pendingCall.CommandId){
                    pendingCall.Accept(response.Result);

                    this.responceBuffer.splice(i, 1);
                    this.pendingCalls.splice(a, 1);
                    
                    return;
                }
            }
        }

        this.pendingCalls.forEach(pendingCall => {
            this.responceBuffer.forEach(responce => {
                if (response.Error != null) {
                    pendingCall.Reject(responce.Error)
                }
                else{
                    pendingCall.Accept(responce.Result);
                }
            
               return;
            });
        });
    }

    /// <summary>
    /// Gets the reponce for a command from the printer.
    /// </summary>
    /// <typeparam name="T">
    /// The type of the response.
    /// </typeparam>
    /// <returns>
    /// A task containing the responce.
    /// </returns>
    public GerPrinterResponce<T extends IPrinterResponce>(commandId: string) : Promise<T>
    {
        var promise = new Promise<T>((a, r) => { 
            var pendingCal = new PendingCall(commandId, a, r);
            this.pendingCalls.push(pendingCal);
            this.TryDrainPendingCalls();
        });
        
        return promise;
    }

    /// <summary>
    /// Generates a response object from returned data.
    /// </summary>
    /// <param name="command">
    /// The command that the response is for.
    /// </param>
    /// <param name="data">
    /// The data in the response.
    /// </param>
    /// <returns>
    /// The response object.
    /// </returns>
    private GenerateResponce(command : string, data : Array<string>) : IPrinterResponce
    {
        switch (command)
        {
            case MachineCommands.GetEndstopStaus:
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
                ///throw new NotImplementedException(string.Format(CultureInfo.InvariantCulture, "Unexpected command: {0}", command));
        }
    }
}