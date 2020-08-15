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
  public DebugLoggingEnabled = false; //= new FormControl('', [ ]);

  private isRegistered = false;

  PrinterCommand = new FormControl('', [
    Validators.required
  ]);

  constructor(private printerService: PrinterServiceWrapperService) {
    this.RegisterForDebugMessages();
  }

  private RegisterForDebugMessages(): void{
    var dbgMonior = this.printerService.GetDebugMonitor();

    if (dbgMonior != null && !this.isRegistered) {
      this.isRegistered = true;
    
      dbgMonior.NewMessage.Register(n => {
        this.ResponseLines.push(this.FormatLine(n));
      });
    }
  }

  ngOnInit(): void {
    var dbgMonior = this.printerService.GetDebugMonitor();
    
    if (dbgMonior != null){
      this.DebugLoggingEnabled = true;
      dbgMonior.GetLog().forEach(l => {
        this.ResponseLines.push(this.FormatLine(l));
      });
    }
    else {
      //this.DebugLoggingEnabled = false;
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

  public DebugLoggingChanged(enabled: boolean){
    //this.DebugLoggingEnabled = enabled;
    if (enabled){
      this.printerService.EnableDebugLogging();
      this.RegisterForDebugMessages();
    }
    else {
      this.printerService.DisableDebugLogging();
      this.isRegistered = false;
      this.ResponseLines = [];
    }
  }
}
