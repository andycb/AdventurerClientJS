import { Component } from '@angular/core';
import { PrinterService } from '../../services/printerService'
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConnectionErrorDialogComponent } from "../connection-error-dialog/connection-error-dialog.component"

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
   * @param dialog The Angular-Material dialog.
   */
  constructor(private printerService: PrinterService, private router: Router, private dialog: MatDialog){
    this.printerService = printerService;
    this.printerService.ConnectionStateChanged.Register((e) => this.OnPrinterStateChanged(e));
    this.printerService.ConnectionError.Register((e) => this.OnPrinterConnectionError(e));
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

  /**
   * Invoked when the printer has a connection error.
   * @param error The error.
   */
  private OnPrinterConnectionError(error: Error) {
    // Open the error dialog and prevent soft dismissing
    const diaRef = this.dialog.open(ConnectionErrorDialogComponent);
    diaRef.disableClose = true;
  }
}