import { Component, OnInit } from '@angular/core';
import { PrinterServiceWrapperService } from '../../Services/printer-service-wrapper.service';
import { ErrorLogger } from 'ElectronApp/Core/ErrorLogger';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {

  public SendInProgress = false;
  constructor(private printerService: PrinterServiceWrapperService) { }

  ngOnInit(): void {
  }

  files: any = [];

  async uploadFile(event) {
    var path = event[0].path;
    if (path){

      try{
        this.SendInProgress = true;
        await this.printerService.StoreFileAsync(path)
        await this.printerService.PrintFileAsync(event[0].name);
        console.log("Done sending");
      }
      catch(e){
        ErrorLogger.NonFatalError(e);
        debugger
      }

      this.SendInProgress = false;
    }
  }
}
