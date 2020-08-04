import { Component, OnInit } from '@angular/core';
import { FormControl, Validators} from '@angular/forms';
import { PrinterServiceWrapperService } from '../../Services/printer-service-wrapper.service';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css']
})
export class DebugComponent implements OnInit {

  public ResponseLines: Array<string>;

  PrinterCommand = new FormControl('', [
    Validators.required
  ]);

  constructor(private printerService: PrinterServiceWrapperService) { }

  ngOnInit(): void {
  }

  public async sendCommand(){
    if (this.PrinterCommand.value.trim().length == 0){
      return;
    }

    var res = await this.printerService.SendDebugCommandAsync(this.PrinterCommand.value.trim());

    console.log("Got respinse");
    res.Responses.forEach(l => console.log(l));
    this.ResponseLines = res.Responses;
  }

}
