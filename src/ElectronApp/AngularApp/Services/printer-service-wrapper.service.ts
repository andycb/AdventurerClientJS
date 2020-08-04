import { Injectable } from '@angular/core';
import { IPrinterService } from "../../Core/IPrinterService"
import { PrinterStatus } from "../../Core/Entities/PrinterStatus"
import { TemperatureResponse } from "../../Core/Entities/TemperatureResponse"
import { DebugResponse } from "../../Core/Entities/DebugResponse"
import { FirmwareVersionResponse } from "../../Core/Entities/FirmwareVersionResponse"
import { EventDispatcher } from "../../Core/EventDispatcher"

@Injectable({
  providedIn: 'root'
})
export class PrinterServiceWrapperService implements IPrinterService {
  public ConnectionStateChanged = new EventDispatcher<boolean>();

  private electronPrinterService: IPrinterService;

  constructor() {
    this.electronPrinterService =  window["PrinterService"];

    this.electronPrinterService.ConnectionStateChanged.Register((e)=> this.ConnectionStateChanged.Invoke(e));
  }

  public GetIsConnected(): boolean {
    return this.electronPrinterService.GetIsConnected();
  }

  GetPrinterStatusAsync(): Promise<PrinterStatus> {
      return this.electronPrinterService.GetPrinterStatusAsync();
   }

   PrintFileAsync(fileName: string): Promise<any> {
      return this.electronPrinterService.PrintFileAsync(fileName);
   }

   StoreFileAsync(filePath: string): Promise<void> {
      return this.electronPrinterService.StoreFileAsync(filePath);
  }

   public ConnectAsync(printerAddress: string) : Promise<any>{
    return this.electronPrinterService.ConnectAsync(printerAddress);
  }

  GetFirmwareVersionAsync() : Promise<FirmwareVersionResponse> {
    return this.electronPrinterService.GetFirmwareVersionAsync();
  }  
  
  GetTemperatureAsync(): Promise<TemperatureResponse> {
    return this.electronPrinterService.GetTemperatureAsync();
  }

  SendDebugCommandAsync(command: string) : Promise<DebugResponse> {
    return this.electronPrinterService.SendDebugCommandAsync(command);
  }
}
