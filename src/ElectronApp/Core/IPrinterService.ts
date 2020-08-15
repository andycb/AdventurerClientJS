
import { PrinterStatus } from "./Entities/PrinterStatus"
import { DebugResponse } from "./Entities/DebugResponse"
import { FirmwareVersionResponse } from "./Entities/FirmwareVersionResponse"
import { TemperatureResponse } from "./Entities/TemperatureResponse"
import { EventDispatcher } from "./EventDispatcher"
import { PrinterDebugMonitor } from "./Entities/PrinterDebugMonitor"

export interface IPrinterService {
    GetIsConnected(): boolean;
    ConnectionStateChanged: EventDispatcher<boolean>;
    ConnectAsync(printerAddress: string) : Promise<any>;
    Disconnect(): void;
    GetPrinterStatusAsync() : Promise<PrinterStatus>;
    SendDebugCommandAsync(command: string) : Promise<DebugResponse>;
    PrintFileAsync(fileName: string) : Promise<any>;
    StoreFileAsync(filePath: string) : Promise<void>;
    GetFirmwareVersionAsync() : Promise<FirmwareVersionResponse>;
    GetTemperatureAsync() : Promise<TemperatureResponse>;
    GetDebugMonitor() : PrinterDebugMonitor;
    EnableDebugLogging(): void;
    DisableDebugLogging();
}