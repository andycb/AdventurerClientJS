import { Component, OnInit } from '@angular/core';
import { PrinterService } from '../../services/printerService';
import { ErrorLogger } from 'electronApp/core/errorLogger';

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
   * Gets a value indicating that a file transfer is in progress.
   */
  public SendInProgress = false;

  /**
   * Gets a value indicating that a file transfer was successful.
   */
  public Success: boolean;

  constructor(private printerService: PrinterService) {

  }

  /**
   * Invoked when the Angular component is initialized.
   */
  ngOnInit(): void {
  }

  /**
   * Sends a selected file to the printer/
   * @param event The HTML event args.
   */
  public async uploadFile(event): Promise<void> {
    const path = event[0].path;

    if (path){
      try{
        this.SendInProgress = true;
        this.Success = false;
        this.ErrorMessage = null;

        await this.printerService.StoreFileAsync(path)
        await this.printerService.PrintFileAsync(event[0].name);
        this.Success = true;
      }
      catch(e){
        ErrorLogger.NonFatalError(e);
        this.ErrorMessage = 'Failed to send file to printer.';
      }

      this.SendInProgress = false;
    }
  }
}
