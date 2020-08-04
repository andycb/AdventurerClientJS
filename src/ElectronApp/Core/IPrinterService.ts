
import { PrinterStatus } from "./Entities/PrinterStatus"
import { DebugResponse } from "./Entities/DebugResponse"
import { FirmwareVersionResponse } from "./Entities/FirmwareVersionResponse"
import { TemperatureResponse } from "./Entities/TemperatureResponse"
import { EventDispatcher } from "./EventDispatcher"

export interface IPrinterService {
    GetIsConnected(): boolean;
    ConnectionStateChanged: EventDispatcher<boolean>;
    ConnectAsync(printerAddress: string) : Promise<any>;
    GetPrinterStatusAsync() : Promise<PrinterStatus>;
    SendDebugCommandAsync(command: string) : Promise<DebugResponse>;
    PrintFileAsync(fileName: string) : Promise<any>;
    StoreFileAsync(filePath: string) : Promise<void>;
    GetFirmwareVersionAsync() : Promise<FirmwareVersionResponse>;
    GetTemperatureAsync() : Promise<TemperatureResponse>;
}