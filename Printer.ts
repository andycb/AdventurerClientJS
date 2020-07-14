var net = require('net');

import { PrinterResponseReader } from "./PrinterResponseReader"
import { PrinterStatus } from "./Entities/PrinterStatus"
import { MachineCommands } from "./MachineCommands"

/// <summary>
/// Represents the printer.
/// </summary>
/// <remarks>
/// This class is NOT currently thread safe. Calling a second method while one is still
/// happening may cause unexpected errors from the printer.
/// </remarks>
export class Printer {
    
    /// <summary>
    /// The IP address of the printer.
    /// <summary>
    readonly printerAddress : string;
    // <summary>
    /// Value indicating if the class has been disposed
    /// </summary>
    private isDisposed : false;
    // <summary>
    /// The WebSocket connection to the printer.
    /// </summary>
    private printerConnection;
    private responseReader : PrinterResponseReader;
    private isConnected : boolean;

    /// <summary>
    /// Initializes a new instance of the Printer class.
    /// </summary>
    /// <param name="ipAddress">
    /// The IP address of the printer to connect to.
    /// </param>
    /// <remarks>
    /// The printer will not be connected to until <see cref="Connect()" /> is called
    /// </remarks>
    public constructor (ipAddress: string) {
        this.printerAddress = ipAddress;
    }
    /// <summary>
    /// Connects to the specified printer.
    /// </summary>
    /// <returns>
    /// A task that compleares once the connection has been established.
    /// </returns>
    async ConnectAsync()
    {
        return new Promise((a, r) => {
            this.printerConnection = new net.Socket();
            this.printerConnection.on('error', ex => {
                this.isConnected = false;
                r(ex);
            });
            this.printerConnection.on('close', () => {
                this.isConnected = false;
            });
            
            this.printerConnection.connect(8899, this.printerAddress, async () => {
                this.responseReader = new PrinterResponseReader(this.printerConnection);
                this.isConnected = true;
                
                await this.GetPrinterStatusAsync();
                a();
            });
        });
    }
    /// <summary>
    /// Gets the current status of the printer.
    /// </summary>
    /// <returns>
    /// A task containing the current printer state.
    /// </returns>
    GetPrinterStatusAsync() : Promise<PrinterStatus>
    {
        this.ValidatePrinterReady();
        var message = "~" + MachineCommands.GetEndstopStaus;
        this.printerConnection.write(message);
        // Get its answer
         return this.responseReader.GerPrinterResponce<PrinterStatus>(MachineCommands.GetEndstopStaus);
    }
    
    /// <summary>
    /// Validates that we are currently in a valid state to communicate with the printer.
    /// </summary>
    private ValidatePrinterReady() : void {
        if (this.isDisposed)
        {
            throw new Error("Printer is no longer connected");
        }
        if (!this.isConnected)
        {
            throw new Error(("Not connected to printer, or connection lost"));
        }
    }
}
