
import { PrinterStatus } from "./Entities/PrinterStatus"
import { EventDispatcher } from "./EventDispatcher"

export interface IPrinterService {
    ConnectionStateChanged: EventDispatcher<boolean>;
    ConnectAsync(printerAddress: string) : Promise<any>;
    GetPrinterStatusAsync() : Promise<PrinterStatus>;
    PrintFileAsync(fileName: string) : Promise<any>;
    StoreFileAsync(filePath: string) : Promise<void>;
}