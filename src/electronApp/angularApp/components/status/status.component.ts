import { Component, OnInit } from '@angular/core';
import { PrinterService } from '../../services/printerService';
import { ErrorLogger } from 'electronApp/core/errorLogger';

/**
 * The printer status component for showing the printer status.
 */
@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  /**
   * Gets the printer status.
   */
  public PrinterStatus: string;

  /**
   * Gets the endstop position.
   */
  public Endstop: string;

  /**
   * Gets the printer build volume.
   */
  public BuildVolume: string;

  /**
   * Gets the printer firmware version
   */
  public FirmwareVersion: string;

  /**
   * Gets the printer serial number.
   */
  public SerialNumber: string;

  /**
   * Gets the printer model name.
   */
  public PrinterName: string;

  /**
   * Gets the temperature (un celsius) of the build plate.
   */
  public BuildPlateTemp: string;

  /**
   * Gets the temperature (un celsius) of the extruder.
   */
  public Tool0Temp: string;

  /**
   * Indicates that the printer camera is available.
   */
  public CameraAvailable: boolean;

  /**
   * Indicates that state of teh camera is loaded.
   */
  public CameraStateLoaded: boolean;

  /**
   * The refresh interval for refreshing the data.
   */
  private refreshInterval: NodeJS.Timeout;

  /**
   * Initializes a new instance of the StatusComponent class.
   * @param printerService The printer service.
   */
  constructor(private printerService: PrinterService) { }

  /**
   * Updates the status text.
   */
  private async UpdateStatusText(): Promise<void> {
    try{
      ErrorLogger.Trace("StatsComponent::UpdateStatusText - Getting Printer Status");
      const status = await this.printerService.GetPrinterStatusAsync();
      this.PrinterStatus = status.MachineStatus;
      this.Endstop = status.Endstop.X.toString() + ',' + status.Endstop.Y.toString() + ',' + status.Endstop.Z.toString();

      ErrorLogger.Trace("StatsComponent::UpdateStatusText - Getting firmware Info");
      const firmwareInfo = await this.printerService.GetFirmwareVersionAsync();
      this.FirmwareVersion = firmwareInfo.FirmwareVersion;
      this.SerialNumber = firmwareInfo.SerialNumber;
      this.PrinterName = firmwareInfo.MachineType;
      this.BuildVolume = firmwareInfo.BuildVolume.X.toString()
        + ',' + firmwareInfo.BuildVolume.Y.toString()
        + ',' + firmwareInfo.BuildVolume.Z.toString();

      ErrorLogger.Trace("StatsComponent::UpdateStatusText - Getting Printer Temp");
      const temp = await this.printerService.GetTemperatureAsync();
      this.Tool0Temp = temp.Tool0Temp.toString();
      this.BuildPlateTemp = temp.BuildPlateTemp.toString();

      this.CameraAvailable = await this.printerService.GetIsCameraEnabled();
      this.CameraStateLoaded = true;
    }
    catch (e){
      ErrorLogger.NonFatalError(e);
    }
  }

  /**
   * Invoked when the Angular component is initialized.
   */
  ngOnInit(): void {
    this.UpdateStatusText();

    this.refreshInterval = setInterval(() => {
      this.UpdateStatusText();
    }, 2000);
  }

  /**
   * Disconnects from the printer.
   */
  public Disconnect(): void{
    this.printerService.Disconnect();
  }

  /**
  * Invoked when the Angular component is destroyed.
  */
  ngOnDestroy(): void  {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }
}
