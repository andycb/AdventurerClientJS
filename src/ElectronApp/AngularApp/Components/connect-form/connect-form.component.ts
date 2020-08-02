import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PrinterServiceWrapperService } from "../../Services/printer-service-wrapper.service"
import { ErrorLogger } from "../../../Core/ErrorLogger"
 
@Component({
  selector: 'app-connect-form',
  templateUrl: './connect-form.component.html',
  styleUrls: ['./connect-form.component.css']
})
export class ConnectFormComponent implements OnInit {

  public isError: boolean;
  private printerService: PrinterServiceWrapperService;

  @Input() PrinterAddress: string;
  @Output() PrinterAddressChange = new EventEmitter<string>();

  constructor(printerService: PrinterServiceWrapperService){
    this.printerService = printerService;
  }

  ngOnInit(): void {

  }

  public async connect(){
    try{
      await this.printerService.ConnectAsync(this.PrinterAddress);
    }
    catch(e) {
      this.isError = true;
      ErrorLogger.NonFatalError(e);
    }
  } 

}
