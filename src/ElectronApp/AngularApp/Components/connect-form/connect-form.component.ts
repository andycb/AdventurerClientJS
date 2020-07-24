import { Component, OnInit } from '@angular/core';
import { PrinterService } from '../../RendererServices/printer.service'

@Component({
  selector: 'app-connect-form',
  templateUrl: './connect-form.component.html',
  styleUrls: ['./connect-form.component.css']
})
export class ConnectFormComponent implements OnInit {

  private printerService: PrinterService;
  public isError : boolean;

  constructor(printerService : PrinterService) {
    this.printerService = printerService;
   }

  ngOnInit(): void {
  }

  public async connect(){
    try{
      await await this.printerService.ConnectAsync("192.168.3.180");
    }
    catch {
      this.isError = true;
    }

  } 

}
