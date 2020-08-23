import { Component } from '@angular/core';
import { PrinterService } from '../../services/printerService'
import { Router } from '@angular/router';

/**
 * Component for hosting the main ap view.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /**
   * Initializes a new instance of the AppComponent class.
   * @param printerService The printer service.
   * @param router The Angular router.
   */
  constructor(private printerService: PrinterService, private router: Router){
    this.printerService = printerService;
    this.printerService.ConnectionStateChanged.Register((e) => this.OnPrinterStateChanged(e));
  }

  /**
   * Invoked when the printer state changes.
   * @param connected Indicates of the app is now connected to the printer.
   */
  private OnPrinterStateChanged(connected: boolean) {
    if (!connected){
      // If we lost connection, force a navigation to show the connect screen.
      this.router.navigate(['connect']);
    }
  }
}