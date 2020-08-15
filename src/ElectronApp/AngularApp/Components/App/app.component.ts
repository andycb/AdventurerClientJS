import { Component } from '@angular/core';
import { PrinterServiceWrapperService } from "../../Services/printer-service-wrapper.service"
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'adventurerclient';

  constructor(private printerService: PrinterServiceWrapperService, private router: Router){
    this.printerService = printerService;

    this.printerService.ConnectionStateChanged.Register((e) => this.OnPrinterStateChanged(e));
  }

  private OnPrinterStateChanged(connected: boolean) {
    if (!connected){
      this.router.navigate(['connect']);
    }
  }
}
