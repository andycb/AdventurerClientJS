import { Component, OnInit } from '@angular/core';
import { PrinterService } from '../../services/printerService'
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Component shown in the connection error dialog.
 */
@Component({
  selector: 'app-connection-error-dialog',
  templateUrl: './connection-error-dialog.component.html',
  styleUrls: ['./connection-error-dialog.component.css']
})
export class ConnectionErrorDialogComponent implements OnInit {

  /**
   * Value indicating that a retry is in progress.
   */
  public IsTryingReconnect = false;

  /**
   * Initializes a new instance of the ConnectionErrorDialogComponent class.
   * @param dialog The dialog that this component is hosted in.
   * @param printerService The printer service.
   * @param router The angular router.
   */
  constructor(
    private dialog: MatDialogRef<ConnectionErrorDialogComponent>, 
    private printerService: PrinterService, 
    private router: Router) {
  }

  /**
   * Closes the dialog and returns to the connection screen.
   */
  public Cancel(): void {
    this.router.navigate(['connect']);
  }

  /**
   * Attempts to restore the connection to the printer.
   */
  public async Reconnect(): Promise<any> {
    const startTime = new Date().getTime();
    
    try {
      this.IsTryingReconnect = true;
      await this.printerService.ReconnectAsync();

      // It worked! Close the dialog
      this.dialog.close();
    }
    catch(e) {
      // It didn't work. Introduce a small delay so
      // it the UI can update and reassure the user that we did actually try.
      const endTime = new Date().getTime();
      const duration = endTime - startTime;
      const delay = Math.max(0, 800 - duration);

      setTimeout(() => {
        this.IsTryingReconnect = false;
      }, delay);
    }
  }

  /**
  * Invoked when the Angular component is initialized.
  */
  ngOnInit(): void {
  }
}
