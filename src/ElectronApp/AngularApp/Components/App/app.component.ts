import { Component } from '@angular/core';
import { PrinterServiceWrapperService } from "../../Services/printer-service-wrapper.service"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'adventurerclient';

  private printerService: PrinterServiceWrapperService;


  constructor(printerService: PrinterServiceWrapperService){
    this.printerService = printerService;

    this.printerService.ConnectionStateChanged.Register((e) => this.OnPrinterStateChanged(e));
  }

  private OnPrinterStateChanged(connected: boolean) {
    this.Isconnected = connected;
  }

  public Isconnected : boolean;
}
