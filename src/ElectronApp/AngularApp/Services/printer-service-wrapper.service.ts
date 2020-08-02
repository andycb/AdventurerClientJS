import { Injectable } from '@angular/core';
import { IPrinterService } from "../../Core/IPrinterService"
import { PrinterStatus } from "../../Core/Entities/PrinterStatus"
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
}
