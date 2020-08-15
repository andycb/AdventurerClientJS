import { Component } from '@angular/core';
import { PrinterService } from "../../Services/PrinterService"
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'adventurerclient';

  constructor(private printerService: PrinterService, private router: Router){
    this.printerService = printerService;

    this.printerService.ConnectionStateChanged.Register((e) => this.OnPrinterStateChanged(e));
  }

  private OnPrinterStateChanged(connected: boolean) {
    if (!connected){
      this.router.navigate(['connect']);
    }
  }
}
