const net = window.require('net');
const fs = window.require('fs');
const { crc32 } = window.require('crc');

import { PrinterResponseReader } from './printerResponseReader';
import { PrinterCamera } from './printerCamera'
import { PrinterStatus, FirmwareVersionResponse, TemperatureResponse, IPrinterResponse, PrinterDebugMonitor } from './entities';
import { MachineCommands } from './machineCommands';
import { PromiseWithProgress } from '../core/PromiseWithProgress'

/**
 * Represents the printer.
 */
export class Printer {
    /**
     * The address of the printer.
     */
    readonly printerAddress: string;

    /**
     * Value indicating if the class has been disposed
     */
    private isDisposed: false;

    /**
     * The socket connection to the printer.
     */
    private printerConnection: any;

    /**
     * The printer response reader.
     */
    private responseReader: PrinterResponseReader;

    /**
     * Indicates that we are currently in the connected state.
     */
    private isConnected: boolean;

    /**
     * The current debug monitor.
     */
    public PrinterDebugMonitor: PrinterDebugMonitor;

    /**
     * Gets the printer's camera.
     */
    public PrinterCamera: PrinterCamera;

    /**
     * The number of bytes sent to the printer in each packet.
     */
    private readonly packetSizeBytes = 4096;

    /**
     * Initializes a new instance of the Printer class.
     * @param ipAddress he IP address of the printer to connect to.
     */
    public constructor(ipAddress: string) {
        this.printerAddress = ipAddress;
        this.PrinterCamera = new PrinterCamera(ipAddress);
    }

    /**
     * Send some data to the printer.
     * @param data The data to send.
     */
    private SendToPrinter(data: string): void {

        data = data + '\n';

        if (this.PrinterDebugMonitor) {
            this.PrinterDebugMonitor.LogDataToPrinter(data);
        }

        this.printerConnection.write(data);
    }

    /**
     * Send some data to the printer.
     * @param data The data to send.
     */
    private SendBufferToPrinter(data: Buffer): void {

        if (this.PrinterDebugMonitor != null) {
            this.PrinterDebugMonitor.LogDataToPrinter(data.toString());
        }

        this.printerConnection.write(data);
    }

    /**
     * Connect to the printer.
     */
    async ConnectAsync(): Promise<void> {
        return new Promise((a, r) => {
            this.printerConnection = new net.Socket();
            this.printerConnection.on('error', (ex: any) => {
                this.isConnected = false;
                r(ex);
            });

            this.printerConnection.on('close', () => {
                this.isConnected = false;
            });

            this.printerConnection.on('data', data => {
                if (this.PrinterDebugMonitor) {
                    this.PrinterDebugMonitor.LogDataFromPrinter(data);
                }
            });

            this.printerConnection.connect(8899, this.printerAddress, async () => {
                this.responseReader = new PrinterResponseReader(this.printerConnection);
                this.isConnected = true;
                this.PrinterCamera.ConnectCamera();

                await this.GetPrinterStatusAsync();
                a();
            });
        });
    }

    /**
     * Disconnect from the printer.
     */
    Disconnect(): void {
        this.printerConnection.destroy();
        this.PrinterCamera.DisconnectCamera();
    }

    /**
     * Stops the printing.
     */
    StopPrintingAsync(): Promise<void> {
        this.ValidatePrinterReady();
        const message = '~' + MachineCommands.StopPrinting;
        this.SendToPrinter(message);

        // Get its answer
        return this.WaitForPrinterAck(MachineCommands.StopPrinting);
    }

    /**
     * Pause the printing.
     */
    PausePrintingAsync(): Promise<void> {
        this.ValidatePrinterReady();
        const message = '~' + MachineCommands.PausePrinting;
        this.SendToPrinter(message);

        // Get its answer
        return this.WaitForPrinterAck(MachineCommands.PausePrinting);
    }

    /**
     * Resume the printing.
     */
    ResumePrintingAsync(): Promise<void> {
        this.ValidatePrinterReady();
        const message = '~' + MachineCommands.ResumePrinting;
        this.SendToPrinter(message);

        // Get its answer
        return this.WaitForPrinterAck(MachineCommands.ResumePrinting);
    }

    /**
     * Gets the current status of the printer.
     */
    GetPrinterStatusAsync(): Promise<PrinterStatus> {
        this.ValidatePrinterReady();
        const message = '~' + MachineCommands.GetEndstopStaus;
        this.SendToPrinter(message);

        // Get its answer
        return this.responseReader.GerPrinterResponse<PrinterStatus>(MachineCommands.GetEndstopStaus);
    }

    /**
     * Gets the firmware version of the printer.
     */
    GetFirmwareVersionAsync(): Promise<FirmwareVersionResponse> {
        this.ValidatePrinterReady();
        const message = '~' + MachineCommands.GetFirmwareVersion;
        this.SendToPrinter(message);

        // Get its answer
        return this.responseReader.GerPrinterResponse<FirmwareVersionResponse>(MachineCommands.GetFirmwareVersion);
    }

    /**
     * Gets the printer temperature.
     */
    GetTemperatureAsync(): Promise<TemperatureResponse> {
        this.ValidatePrinterReady();
        const message = '~' + MachineCommands.GetTemperature;
        this.SendToPrinter(message);

        // Get its answer
        return this.responseReader.GerPrinterResponse<TemperatureResponse>(MachineCommands.GetTemperature);
    }

    /**
     * Sends a command to the printer
     * @param command The full command and any params to send to the printer.
     */
    SendDebugCommandAsync(command: string): Promise<void> {
        this.ValidatePrinterReady();
        const message = '~' + command;
        this.SendToPrinter(message);

        // Get its answer
        return this.WaitForPrinterAck(command);
    }

    /**
     * Instructs the printer to print a file already stored in its internal storage.
     * @param fileName The file name (including extension) of the file to print.
     */
    PrintFileAsync(fileName: string): Promise<void> {
        this.ValidatePrinterReady();
        const message = '~' + MachineCommands.PrintFileFromSd + ' 0:/user/' + fileName;
        this.SendToPrinter(message);

        return this.WaitForPrinterAck(MachineCommands.PrintFileFromSd);
    }

        /**
     * Transfers a file to the printer's storage with a given name.
     * @param filePath The path to the file to transfer.
     * @param fileName The name of the file to store it as (without file extension)
     */
    StoreFileAsync(filePath: string, fileName: string): PromiseWithProgress<void> {
        return new PromiseWithProgress<void>((updateProgress: (value: number) => void) => {
            return this.StoreFileAsyncInternal(filePath, fileName, updateProgress);
        });
    }

    /**
     * Transfers a file to the printer's storage with a given name.
     * @param filePath The path to the file to transfer.
     * @param fileName The name of the file to store it as (without file extension)
     * @param updateProgress The function to cal with progress updates
     */
    private async StoreFileAsyncInternal(filePath: string, fileName: string, updateProgress: (number: number) => void): Promise<void> {
        this.ValidatePrinterReady();

        // Load the file from disk
        const modelBytes = await new Promise<Buffer>((a, r) => {
            fs.readFile(filePath, (error: any, data: any) => {
                if (error) {
                    r(error);
                }

                a(data);
            });
        });

        // Start a transfer
        let message = '~' + MachineCommands.BeginWriteToSdCard + ' ' + modelBytes.length + ' 0:/user/' + fileName;
        this.SendToPrinter(message);
        await this.WaitForPrinterAck(MachineCommands.BeginWriteToSdCard);

        let count = 0;
        let offset = 0;
        while (offset < modelBytes.length) {
            let crc: number;
            let packet: Buffer;

            let dataSize = 0;
            if (offset + this.packetSizeBytes < modelBytes.length) {
                packet = modelBytes.subarray(offset, offset + this.packetSizeBytes);

                const crcResult = crc32(packet);
                crc = crcResult;
                dataSize = this.packetSizeBytes;
            }
            else {
                // Every packet needs to be the same size, so zero pad the last one if we need to.
                const actualLength = modelBytes.length - offset;
                const data = modelBytes.subarray(offset, actualLength + offset);

                // The CRC is for the un-padded data.
                const crcResult = crc32(data);
                crc = crcResult;

                packet = Buffer.alloc(this.packetSizeBytes);
                for (let i = 0; i < data.length; ++i) {
                    packet.writeUInt32LE(data[i], i);
                }

                packet.fill(null, actualLength, this.packetSizeBytes);

                dataSize = actualLength;
            }


            // Always start each packet with four bytes
            const bufferToSend = Buffer.alloc(this.packetSizeBytes + 16);
            bufferToSend.writeUInt16LE(0x5a, 0);
            bufferToSend.writeUInt16LE(0x5a, 1);
            bufferToSend.writeUInt16LE(0xef, 2);
            bufferToSend.writeUInt16LE(0xbf, 3);

            // Add the count of this packet, the size of the data it in (not counting padding) and the CRC.
            bufferToSend.writeUInt32BE(count, 4);
            bufferToSend.writeUInt32BE(dataSize, 8);
            bufferToSend.writeUInt32BE(crc, 12);

            // Add the data
            for (let i = 0; i < packet.length; ++i) {
                bufferToSend.writeUInt8(packet[i], i + 16);
            }

            // Send it to the printer
            this.SendBufferToPrinter(bufferToSend);

            // Update the progress
            const progress = offset / modelBytes.length;
            updateProgress(progress);

            offset += this.packetSizeBytes;
            ++count;
        }

        this.SendToPrinter('');

        // Tell the printer that we have finished the file transfer
        message = '~' + MachineCommands.EndWriteToSdCard;

        this.SendToPrinter(message);

        return this.WaitForPrinterAck(MachineCommands.EndWriteToSdCard);
    }

    /**
     * Waits fot the printer to acknowledge that a command send to it completed.
     */
    private async WaitForPrinterAck(commandId: string): Promise<void> {
        await this.responseReader.GerPrinterResponse<IPrinterResponse>(commandId);
    }

    /**
     * Validates that we are currently in a valid state to communicate with the printer.
     */
    private ValidatePrinterReady(): void {
        if (this.isDisposed) {
            throw new Error('Printer is no longer connected');
        }
        if (!this.isConnected) {
            throw new Error(('Not connected to printer, or connection lost'));
        }
    }
}
