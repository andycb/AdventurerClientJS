import { Component, OnInit } from '@angular/core';
import { PrinterService } from '../../services/printerService'
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-stopr-printing-confirmation-dialog',
  templateUrl: './stopr-printing-confirmation-dialog.component.html',
  styleUrls: ['./stopr-printing-confirmation-dialog.component.css']
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
    this.printerService.StopPrintingAsync();
    this.dialog.close();
  }

  /**
  * Invoked when the Angular component is initialized.
  */
  ngOnInit(): void {
  }
}
