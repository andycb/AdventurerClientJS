import { Component, OnInit } from '@angular/core';
import { PrinterService } from '../../services/printerService';
import { ErrorLogger } from 'electronApp/core/errorLogger';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TransferringDialogComponent } from "../transferring-dialog/transferring-dialog.component"

/**
 * The Print component for sending files to the printer.
 */
@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {
  /**
   * The files selected in the file picker.
   */
  public files: any = [];

  /**
   * Gets the error message to show.
   */
  public ErrorMessage: string;

  /**
   * Gets a value indicating that a file transfer was successful.
   */
  public Success: boolean;

  /**
   * Reference to the transferring dialog.
   */
  private dialogRef: MatDialogRef<TransferringDialogComponent> = null;

  /**
   * Initializes a new instance of the StatusComponent class.
   * @param printerService Teh printer service.
   * @param dialog A material dialog.
   */
  constructor(private printerService: PrinterService, private dialog: MatDialog) {

  }

  /**
   * Invoked when the Angular component is initialized.
   */
  ngOnInit(): void {
  }

  /**
  * Invoked when the Angular component is destroyed.
  */
 ngOnDestroy(): void {
  if (this.dialogRef) {
    this.dialogRef.close();
  }
}

  /**
   * Sends a selected file to the printer/
   * @param event The HTML event args.
   */
  public uploadFile(event): void {
    const path = event[0].path;

    if (path){
      const startTime = new Date().getTime();

      // Show a dialog
      this.dialogRef = this.dialog.open(TransferringDialogComponent);
      this.dialogRef.disableClose = true;

      setImmediate(async () => {
        try{ 
          this.Success = false;
          this.ErrorMessage = null;
  
          ErrorLogger.Trace("PrintComponent::uploadFile - Storing file");
          await this.printerService.StoreFileAsync(path)
  
          ErrorLogger.Trace("PrintComponent::uploadFile - Printing file");
          await this.printerService.PrintFileAsync(event[0].name);
          this.Success = true;
        }
        catch(e){
          ErrorLogger.NonFatalError(e);
          this.ErrorMessage = 'Failed to send file to printer.';
        }
  
        // Introduce a small delay so that with small files 
        // the user gets to actually see the UI rather than a flicker
        const endTime = new Date().getTime();
        const duration = endTime - startTime;
        const delay = Math.max(0, 800 - duration);

        setTimeout(() => {
          this.dialogRef.close();
          this.dialogRef = null;
        }, delay);
      });
    }
  }
}
