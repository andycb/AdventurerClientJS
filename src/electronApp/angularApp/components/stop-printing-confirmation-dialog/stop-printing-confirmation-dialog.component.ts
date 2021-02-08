import { Component, OnInit } from '@angular/core';
import { PrinterService } from '../../services/printerService'
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorLogger } from 'electronApp/core/errorLogger';

@Component({
  selector: 'app-stopr-printing-confirmation-dialog',
  templateUrl: './stop-printing-confirmation-dialog.component.html',
  styleUrls: ['./stop-printing-confirmation-dialog.component.css']
})
export class StoprPrintingConfirmationDialogComponent implements OnInit {

  /**
   * Initializes a new instance of the StoprPrintingConfirmationDialogComponent class.
   * @param dialog The dialog that this component is hosted in.
   * @param printerService The printer service.
   */
  constructor(
    private dialog: MatDialogRef<StoprPrintingConfirmationDialogComponent>,
    private printerService: PrinterService) {
  }

  /**
   * Closes the dialog
   */
  public Cancel(): void {
    this.dialog.close();
  }

  /**
   * Stops the printing.
   */
  public async StopPrintingAsync(): Promise<any> {
    try {
      this.printerService.StopPrintingAsync();
    } catch (error) {
      throw new ErrorLogger.NonFatalError(error);
    }
    this.dialog.close();
  }

  /**
  * Invoked when the Angular component is initialized.
  */
  ngOnInit(): void {
  }
}
