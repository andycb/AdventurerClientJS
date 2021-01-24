import { PrinterStatus, FirmwareVersionResponse, TemperatureResponse, PrinterDebugMonitor } from '../../printerSdk/entities';
import { PrinterCamera } from '../../printerSdk/printerCamera'
import { EventDispatcher, PromiseWithProgress } from '../../core';

/**
 * Interface fot the printer service.
 */
export interface IPrinterService {

    /**
     * Invoked when the printer connection state changes.
     */
    ConnectionStateChanged: EventDispatcher<boolean>;

    /**
     * Invoked when there is an error communicating with the printer.
     */
    ConnectionError: EventDispatcher<Error>;

    /**
     * Gets a value indicating if the client is currently connected to a printer.
     */
    GetIsConnected(): boolean;

    /**
     * Attempts to connect to a printer.
     * @param printerAddress The address of the printer.
     */
    ConnectAsync(printerAddress: string): Promise<any>;

    /**
     * Disconnects from the current printer.
     */
    Disconnect(): void;

    /**
     * Stops the printing.
     */
    StopPrintingAsync(): Promise<void>;

    /**
     * Pauses the printing.
     */
    PausePrintingAsync(): Promise<void>;

    /**
     * Resumes the printing.
     */
    ResumePrintingAsync(): Promise<void>;


    /**
     * Resets the connection and attempts to reconnect to the printer.
     */
    ReconnectAsync(): Promise<any>;

    /**
     * Requests the current status from the printer.
     */
    GetPrinterStatusAsync(): Promise<PrinterStatus>;

    /**
     * Sends a command to the printer.
     * @param command The command.
     */
    SendDebugCommandAsync(command: string): Promise<void>;

    /**
     * Requests that the printer print a file from its storage.
     * @param fileName The name of the file stored on the printer's storage.
     */
    PrintFileAsync(fileName: string): Promise<any>;

    /**
     * Send a file to the printer and stores it in internal storage.
     * Note. If the file name ends with .gx, it will be unmodified, but .gocde will files
     * will be renamed to .g.
     * @param filePath The path of the file to transferer.
     */
    StoreFileAsync(filePath: string): PromiseWithProgress<void>;

    /**
     * Requests the firmware version info from the printer.
     */
    GetFirmwareVersionAsync(): Promise<FirmwareVersionResponse>;

    /**
     * Requests the temperature info from the printer.
     */
    GetTemperatureAsync(): Promise<TemperatureResponse>;

    /**
     * Gets the printer camera.
     */
    GetCamera(): PrinterCamera;

    /***
     * Gets the current debug monitor.
     */
    GetDebugMonitor(): PrinterDebugMonitor;

    /**
     * Enables logging of al printer traffic.
     */
    EnableDebugLogging(): void;

    /**
     * Disable traffic logging.
     */
    DisableDebugLogging(): void;
}
