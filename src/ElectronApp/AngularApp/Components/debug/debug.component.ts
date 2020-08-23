import { Component, OnInit } from '@angular/core';
import { FormControl, Validators} from '@angular/forms';
import { PrinterService } from '../../services/printerService';
import { LoggedMessage, LoggedMessageDirection } from '../../../printerSdk/entities';

/**
 * Error matcher for teh printer address.
 */
@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css']
})
export class DebugComponent implements OnInit {

  /**
   * Gets all of debug lines.
   */
  public ResponseLines: Array<string> = [];

  /**
   * Gets a value indicating that debugging is enabled.
   */
  public DebugLoggingEnabled = false;

  /**
   * Indicates that the debug event subscription is registered.
   */
  private isRegistered = false;

  /**
   * The printer command form.
   */
  PrinterCommand = new FormControl('', [
    Validators.required
  ]);

  /**
   * Initializes a new instance of the DebugComponent class.
   * @param printerService The printer service.
   */
  constructor(private printerService: PrinterService) {
    this.RegisterForDebugMessages();
  }

  private RegisterForDebugMessages(): void{
    const dbgMonitor = this.printerService.GetDebugMonitor();

    if (dbgMonitor != null && !this.isRegistered) {
      this.isRegistered = true;

      dbgMonitor.NewMessage.Register(n => {
        this.ResponseLines.push(this.FormatLine(n));
      });
    }
  }

   /**
    * Invoked when the Angular component is initialized.
    */
  ngOnInit(): void {
    const dbgMonitor = this.printerService.GetDebugMonitor();

    if (dbgMonitor != null) {
      this.DebugLoggingEnabled = true;

      // Add all of the debug messages to the collection
      dbgMonitor.GetLog().forEach(l => {
        this.ResponseLines.push(this.FormatLine(l));
      });
    }
  }

  /**
   * Formats a debug line for display.
   * @param line The line to format.
   */
  private FormatLine(line: LoggedMessage): string {
    // Replace new lines with rendered escape sequence
    let str = line.Message.toString().replace(new RegExp('\n', 'g'), '\\n');

    return (line.Direction == LoggedMessageDirection.FromPrinter ? '>>>' : '<<<') + str;
  }

  /**
   * Sends a command to the printer.
   */
  public async sendCommand(): Promise<void> {
    if (this.PrinterCommand.value.trim().length === 0){
      return;
    }

    await this.printerService.SendDebugCommandAsync(this.PrinterCommand.value.trim());
  }

  /**
   * Invoked when the enable logging toggle is toggled.
   * @param enabled Indicates that logging is enabled
   */
  public DebugLoggingChanged(enabled: boolean): void {
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
