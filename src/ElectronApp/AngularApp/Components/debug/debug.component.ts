import { Component, OnInit } from '@angular/core';
import { FormControl, Validators} from '@angular/forms';
import { PrinterServiceWrapperService } from '../../Services/printer-service-wrapper.service';
import { PrinterDebugMonitor, LoggedMessage, LoggedMessageDirection } from "../../../Core/Entities/PrinterDebugMonitor"

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css']
})
export class DebugComponent implements OnInit {

  public ResponseLines: Array<string> = [];

  PrinterCommand = new FormControl('', [
    Validators.required
  ]);

  constructor(private printerService: PrinterServiceWrapperService) {
    var dbgMonior = this.printerService.GetDebugMonitor();
    if (dbgMonior != null){
      dbgMonior.NewMessage.Register(n => {
        this.ResponseLines.push(this.FormatLine(n));
      });
    }
  }

  ngOnInit(): void {
    var dbgMonior = this.printerService.GetDebugMonitor();
    if (dbgMonior != null){
      dbgMonior.GetLog().forEach(l => {
        this.ResponseLines.push(this.FormatLine(l));
      });
    }
  }

  private FormatLine(line: LoggedMessage): string {
    var str = line.Mesage.toString().replace(new RegExp("\n", "g"), "\\n");
    
    return (line.Direction == LoggedMessageDirection.FromPrinter ? ">>>" : "<<<") + str;
  }

  public async sendCommand(){
    if (this.PrinterCommand.value.trim().length == 0){
      return;
    }

    await this.printerService.SendDebugCommandAsync(this.PrinterCommand.value.trim());
  }

}
