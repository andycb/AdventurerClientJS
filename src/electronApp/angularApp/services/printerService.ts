import { Injectable } from '@angular/core';
import { IPrinterService } from './iPrinterService';
import { PrinterStatus, TemperatureResponse, FirmwareVersionResponse, PrinterDebugMonitor,  } from '../../printerSdk/entities';
import { Printer } from '../../printerSdk/printer';
import { PrinterCamera } from '../../printerSdk/printerCamera'
import { ErrorLogger, PromiseWithProgress, EventDispatcher } from '../../core';

const path = window.require('path');

/**
 * Injectable Printer service for communicating with printers.
 */
@Injectable({
    providedIn: 'root'
})
export class PrinterService implements IPrinterService {
    /**
     * Indicates that a printer is currently connected.
     */
    private isConnected: boolean;

    /**
     * The current printer instance.
     */
    printer: Printer = null;

    /**
     * The interval for the heartbeat.
     */
    heartbeatInterval: NodeJS.Timeout;

    /** @inheritdoc */
    public readonly ConnectionStateChanged = new EventDispatcher<boolean>();

    /** @inheritdoc */
    public readonly ConnectionError = new EventDispatcher<Error>();

    /** @inheritdoc */
    public GetIsConnected(): boolean {
        return this.isConnected;
    }

    /** @inheritdoc */
    public async ConnectAsync(printerAddress: string): Promise<any> {
        this.printer = new Printer(printerAddress);
        await this.printer.ConnectAsync();

        this.isConnected = true;
        this.ConnectionStateChanged.Invoke(true);

        // Poll the printer every 5 sections to keep the connection alive, otherwise the printer will close the connection.
        this.heartbeatInterval = setInterval(async () => {
            try {
                await this.printer.GetPrinterStatusAsync();
            }
            catch (e) {
                this.ConnectionError.Invoke(e);
                ErrorLogger.NonFatalError(e);
                if (this.heartbeatInterval) {
                    clearInterval(this.heartbeatInterval);
                    this.heartbeatInterval = null;
                }
            }
        }, 5000);
    }

    /** @inheritdoc */
    public Disconnect() {
        this.DisconnectInternal(true);
    }

    /** @inheritdoc */
    public StopPrintingAsync(): Promise<void> {
        if (this.printer == null) {
            throw new Error('Cannot call this method before calling and awaiting ConnectAsnc()');
        }

        return this.printer.StopPrintingAsync();
    }

    /** @inheritdoc */
    public PausePrintingAsync(): Promise<void> {
        if (this.printer == null) {
            throw new Error('Cannot call this method before calling and awaiting ConnectAsnc()');
        }

        return this.printer.PausePrintingAsync();
    }

    /** @inheritdoc */
    public ResumePrintingAsync(): Promise<void> {
        if (this.printer == null) {
            throw new Error('Cannot call this method before calling and awaiting ConnectAsnc()');
        }

        return this.printer.ResumePrintingAsync();
    }

    /** @inheritdoc */
    public async ReconnectAsync(): Promise<any> {
        if (this.printer == null) {
            throw new Error('Cannot call this method before calling and awaiting ConnectAsnc()');
        }

        const address = this.printer.printerAddress;
        this.DisconnectInternal(false);
        await this.ConnectAsync(address);
    }

    /** @inheritdoc */
    public GetPrinterStatusAsync(): Promise<PrinterStatus> {
        if (this.printer == null) {
            throw new Error('Cannot call this method before calling and awaiting ConnectAsnc()');
        }

        return this.printer.GetPrinterStatusAsync();
    }

    /** @inheritdoc */
    public PrintFileAsync(fileName: string): Promise<any> {
        if (this.printer == null) {
            throw new Error('Cannot call this method before calling and awaiting ConnectAsnc()');
        }

        return this.printer.PrintFileAsync(fileName);
    }

    /** @inheritdoc */
    public SendDebugCommandAsync(command: string): Promise<void> {
        if (this.printer == null) {
            throw new Error('Cannot call this method before calling and awaiting ConnectAsnc()');
        }

        return this.printer.SendDebugCommandAsync(command);
    }

    /** @inheritdoc */
    public GetFirmwareVersionAsync(): Promise<FirmwareVersionResponse> {
        if (this.printer == null) {
            throw new Error('Cannot call this method before calling and awaiting ConnectAsnc()');
        }

        return this.printer.GetFirmwareVersionAsync();
    }

    /** @inheritdoc */
    public GetTemperatureAsync(): Promise<TemperatureResponse> {
        if (this.printer == null) {
            throw new Error('Cannot call this method before calling and awaiting ConnectAsnc()');
        }

        return this.printer.GetTemperatureAsync();
    }

    /** @inheritdoc */
    public StoreFileAsync(filePath: string): PromiseWithProgress<void>{ 
        if (this.printer == null) {
            throw new Error('Cannot call this method before calling and awaiting ConnectAsnc()');
        }

        // Deal with .gcode files by stripping the extension and using .g. Leave gx files alone
        const pathInfo = path.parse(filePath);

        let fileName = pathInfo.name;
        const extension = pathInfo.ext.toLowerCase();
        if (extension !== '.g' && extension !== '.gx' && extension !== '.gcode') {
            throw new Error('Invalid file type');
        }

        if (extension !== '.gx') {
            fileName = fileName + '.g';
        }
        else {
            fileName = fileName + '.gx';
        }

        return this.printer.StoreFileAsync(filePath, fileName);
    }

    /** @inheritdoc */
    GetCamera(): PrinterCamera {
        if (this.printer == null){
            throw new Error('Cannot call this method before calling and awaiting ConnectAsnc()');
        }

        return this.printer.PrinterCamera;
    }

    /** @inheritdoc */
    GetCameraVideoStreamAddress(): string {
        if (this.printer == null) {
            throw new Error('Cannot call this method before calling and awaiting ConnectAsnc()');
        }

        return this.printer.PrinterCamera.GetStreamAddress();
    }

    /** @inheritdoc */
    public GetDebugMonitor(): PrinterDebugMonitor {
        return this.printer.PrinterDebugMonitor;
    }

    /** @inheritdoc */
    public EnableDebugLogging(): void {
        if (this.printer.PrinterDebugMonitor == null) {
            this.printer.PrinterDebugMonitor = new PrinterDebugMonitor();
        }
    }

    /** @inheritdoc */
    public DisableDebugLogging(): void {
        this.printer.PrinterDebugMonitor = null;
    }

    /**
     * Disconnects from the current printer.
     * @param raiseEvents Indicates is connection state changed events should be raised.
     */
    private DisconnectInternal(raiseEvents: boolean) {
        this.printer.Disconnect();
        this.printer = null;
        this.isConnected = false;

        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }

        if (raiseEvents) {
            this.ConnectionStateChanged.Invoke(false);
        }
    }
}
