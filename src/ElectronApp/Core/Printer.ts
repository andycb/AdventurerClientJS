var net = window.require('net');
var fs = window.require('fs');
const { crc32 } = window.require('crc');

import { PrinterResponseReader } from "./PrinterResponseReader"
import { PrinterStatus } from "./Entities/PrinterStatus"
import { DebugResponse } from "./Entities/DebugResponse"
import { FirmwareVersionResponse } from "./Entities/FirmwareVersionResponse"
import { TemperatureResponse } from "./Entities/TemperatureResponse"
import { IPrinterResponce } from "./Entities/IPrinterResponce"
import { MachineCommands } from "./MachineCommands"
import { PrinterDebugMonitor } from "./Entities/PrinterDebugMonitor"


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
    /// The socket connection to the printer.
    /// </summary>
    private printerConnection : any;

    // <summary>
    /// The printer response reader.
    /// </summary>
    private responseReader : PrinterResponseReader;

    // <summary>
    /// Indicates that we are currently in the connected state.
    /// </summary>
    private isConnected : boolean;

    /// <summary>
    /// The number of bytes sent to the printer in each packet.
    /// </summary>
    private readonly packetSizeBytes = 4096;

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

    public PrinterDebugMonitor: PrinterDebugMonitor;

    private SendToPrinter(data: string): void {

        data = data + "\n";

        if (this.PrinterDebugMonitor){
            this.PrinterDebugMonitor.LogDataToPrinter(data);
        }

        this.printerConnection.write(data);
    }

    private SendBufferToPrinter(data: Buffer): void {

        if (this.PrinterDebugMonitor != null){
            this.PrinterDebugMonitor.LogDataToPrinter(data.toString());
        }

        this.printerConnection.write(data);
    }

    /// <summary>
    /// Connects to the specified printer.
    /// </summary>
    /// <returns>
    /// A task that compleares once the connection has been established.
    /// </returns>
    async ConnectAsync() {
        return new Promise((a, r) => {
            this.printerConnection = new net.Socket();
            this.printerConnection.on('error', (ex : any) => {
                this.isConnected = false;
                r(ex);
            });
            
            this.printerConnection.on('close', () => {
                this.isConnected = false;
            });

            this.printerConnection.on('data', data => {
                if (this.PrinterDebugMonitor){
                    this.PrinterDebugMonitor.LogDataFromPriter(data)
                }
            });
            
            this.printerConnection.connect(8899, this.printerAddress, async () => {
                this.responseReader = new PrinterResponseReader(this.printerConnection);
                this.isConnected = true;
                
                await this.GetPrinterStatusAsync();
                a();
            });
        });
    }

    Disconnect(){
        this.printerConnection.destroy();
    }

    /// <summary>
    /// Gets the current status of the printer.
    /// </summary>
    /// <returns>
    /// A task containing the current printer state.
    /// </returns>
    GetPrinterStatusAsync() : Promise<PrinterStatus> {
        this.ValidatePrinterReady();
        var message = "~" + MachineCommands.GetEndstopStaus;
        this.SendToPrinter(message);

        // Get its answer
        return this.responseReader.GerPrinterResponce<PrinterStatus>(MachineCommands.GetEndstopStaus);
    }

    /// <summary>
    /// Gets the firmware version of the printer.
    /// </summary>
    /// <returns>
    /// A task containing the current printer state.
    /// </returns>
    GetFirmwareVersionAsync() : Promise<FirmwareVersionResponse> {
        this.ValidatePrinterReady();
        var message = "~" + MachineCommands.GetFirmwareVersion;
        this.SendToPrinter(message);

        // Get its answer
        return this.responseReader.GerPrinterResponce<FirmwareVersionResponse>(MachineCommands.GetFirmwareVersion);
    }
    
    /// <summary>
    /// Gets the printer temperature.
    /// </summary>
    /// <returns>
    /// A task containing the current printer state.
    /// </returns>
    GetTemperatureAsync() : Promise<TemperatureResponse> {
        this.ValidatePrinterReady();
        var message = "~" + MachineCommands.GetTemperature;
        this.SendToPrinter(message);

        // Get its answer
        return this.responseReader.GerPrinterResponce<TemperatureResponse>(MachineCommands.GetTemperature);
    }

    /// <summary>
    /// Senda a command to the printer and returns its raw response.
    /// </summary>
    /// <param name="command">
    /// The full command and any params to send to the printer. 
    /// Do not include the leading ~
    /// </param>
    SendDebugCommandAsync(command: string) : Promise<void> {
        this.ValidatePrinterReady();
        var message = "~" + command;
        console.log(message);
        this.SendToPrinter(message);

        // Get its answer
        return this.WaitForPrinterAck(command);
    }

    /// <summary>
    /// Instructs the printer to print a file already stored in its internal memory.
    /// </summary>
    /// <param name="fileName">
    /// The file name (including extention) of the file to print.
    /// </param>
    /// <returns>
    /// A task that will complete when the command is sent to the printer and it starts printing.
    /// </returns>
    PrintFileAsync(fileName : string) : Promise<void>
    {
        this.ValidatePrinterReady();
        var message = "~" + MachineCommands.PrintFileFromSd + " 0:/user/" + fileName;
        this.SendToPrinter(message);

        return this.WaitForPrinterAck(MachineCommands.PrintFileFromSd);
    }

    /// <summary>
    /// Transfers a file to the printer's storage with a given name.
    /// </summary>
    /// <param name="filePath">
    /// The path to the file to transfer.
    /// </param>
    /// <param name="fileName">
    /// The name of the file to store it as (without file extension)
    /// </param>
    /// <returns>
    /// A task that will complete once the file has been send to the printer.
    /// </returns>
    async StoreFileAsync(filePath: string, fileName : string)
    {
        this.ValidatePrinterReady();

        // Load teh file from disk
        var modelBytes = await new Promise<Buffer>((a, r) => {
            fs.readFile(filePath, (error : any, data : any) => {
                if (error){
                    r(error);
                }

                a(data);
            });
        });

        // Start a transfer
        var message = "~" + MachineCommands.BeginWriteToSdCard + " " + modelBytes.length + " 0:/user/" + fileName;
        this.SendToPrinter(message);
        await this.WaitForPrinterAck(MachineCommands.BeginWriteToSdCard);

        var count = 0;
        var offset = 0;        
        while (offset < modelBytes.length)
        {
            var crc : number;
            var packet : Buffer;

            var dataSize = 0;
            if (offset + this.packetSizeBytes < modelBytes.length)
            {
                packet = modelBytes.subarray(offset, offset + this.packetSizeBytes);

                var crcResult = crc32(packet);
                crc = crcResult;
                dataSize = this.packetSizeBytes;
            }
            else
            {
                // Every packet needs to be the same size, so zero pad the last one if we need to.
                var actualLength = modelBytes.length - offset;
                var data = modelBytes.subarray(offset, actualLength + offset);

                // The CRC is for the un-padded data.
                var crcResult = crc32(data);
                crc = crcResult;

                for (var i = 0; i < data.length; ++i){
                    var t = data[i];
                    packet.writeUInt32LE(t, i);
                }

                packet.fill(null, actualLength, this.packetSizeBytes);

                dataSize = actualLength;
            }


            // Always start each packet with four bytes
            var bufferToSend = Buffer.alloc(this.packetSizeBytes + 16);
            bufferToSend.writeUInt16LE(0x5a, 0)
            bufferToSend.writeUInt16LE(0x5a, 1)
            bufferToSend.writeUInt16LE(0xef, 2)
            bufferToSend.writeUInt16LE(0xbf, 3)

            // Add the count of this packet, the size of the data it in (not counting padding) and the CRC.
            bufferToSend.writeUInt32BE(count, 4);
            bufferToSend.writeUInt32BE(dataSize, 8);
            bufferToSend.writeUInt32BE(crc, 12);

            // Add the data
            for (var i = 0; i < packet.length; ++i){
                bufferToSend.writeUInt8(packet[i], i + 16)
            }

            // Send it to the printer
            this.SendBufferToPrinter(bufferToSend);

            offset += this.packetSizeBytes;
            ++count;
        }

        this.SendToPrinter("");

        // Tell the printer that we have finished the file transfer
        var message = "~" + MachineCommands.EndWriteToSdCard;

        this.SendToPrinter(message);
        
        return this.WaitForPrinterAck(MachineCommands.EndWriteToSdCard);
    }

    /// <summary>
    /// Waits fot the printer to acknowledge that a command send to it completed.
    /// </summary>
    /// <returns>
    /// A task that will complete when the printer acknowledges the command.
    /// </returns>
    private async WaitForPrinterAck(commandId : string) : Promise<void>
    {
        await this.responseReader.GerPrinterResponce<IPrinterResponce>(commandId);
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
