import { Component, OnInit } from '@angular/core';
import { PrinterService } from '../../Services/PrinterService';
import { ErrorLogger } from 'ElectronApp/Core/ErrorLogger';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {

  public SendInProgress = false;
  public Success: boolean;
  constructor(private printerService: PrinterService) { }

  ngOnInit(): void {
  }

  public files: any = [];
  public ErrorMessage: string;

  async uploadFile(event) {
    var path = event[0].path;

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
        this.ErrorMessage = "Failed to send file to printer."
      }

      this.SendInProgress = false;
    }
  }
}
