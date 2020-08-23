import { PrinterStatus, FirmwareVersionResponse, TemperatureResponse, PrinterDebugMonitor } from '../../printerSdk/entities';
import { EventDispatcher } from '../../core/eventDispatcher';

/**
 * Interface fot the printer service.
 */
export interface IPrinterService {

    /**
     * Invoked when the printer connection state changes.
     */
    ConnectionStateChanged: EventDispatcher<boolean>;
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
    StoreFileAsync(filePath: string): Promise<void>;

    /**
     * Requests the firmware version info from the printer.
     */
    GetFirmwareVersionAsync(): Promise<FirmwareVersionResponse>;

    /**
     * Requests the temperature info from the printer.
     */
    GetTemperatureAsync(): Promise<TemperatureResponse>;

    /***
     * Gets the current debug monitor.
     */
    GetDebugMonitor(): PrinterDebugMonitor;

    /**
     * Enables logging of al printer traffic.
     */
    EnableDebugLogging(): void;

    /**
     * Disabled traffic logging.
     */
    DisableDebugLogging(): void;
}
