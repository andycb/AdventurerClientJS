import { Component, OnInit } from '@angular/core';
import { PrinterService } from '../../services/printerService';
import { ErrorLogger } from 'electronApp/core/errorLogger';
import { StoprPrintingConfirmationDialogComponent } from "../stop-printing-confirmation-dialog/stop-printing-confirmation-dialog.component";
import { MatDialog } from '@angular/material/dialog';
import { CameraState } from '../../../printerSdk/printerCamera'

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
   * Gets the printer mode.
   */
  public MoveMode: string;

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
   * Indicates that the printer is paused.
   */
  public PrintPaused: boolean;

  /**
   * Indicates that state of the camera is loaded.
   */
  public CameraStateLoaded: boolean;

  /**
    * Indicates that the state of the print is loaded.
    */
  public PrintStateLoaded: boolean;

  /**
   * The printer is printing.
   */
  public IsPrinting: boolean;

  /**
   * The refresh interval for refreshing the data.
   */
  private refreshInterval: NodeJS.Timeout;

  /**
   * Initializes a new instance of the StatusComponent class.
   * @param printerService The printer service.
   * @param dialog The Angular-Material dialog.
   */
  constructor(private printerService: PrinterService, private dialog: MatDialog) { }

  /**
   * Updates the status text.
   */
  private async UpdateStatusText(): Promise<void> {
    try {
      ErrorLogger.Trace("StatsComponent::UpdateStatusText - Getting Printer Status");
      const status = await this.printerService.GetPrinterStatusAsync();
      this.PrinterStatus = status.MachineStatus;
      this.MoveMode = status.MoveMode;
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

      const cameraState = this.printerService.GetCamera().CameraState;
      this.CameraAvailable = cameraState == CameraState.Available;
      this.CameraStateLoaded = cameraState != CameraState.Unknown;

      if (status.MoveMode == "PAUSED") {
        this.PrintPaused = true;
      } else {
        this.PrintPaused = false;
      }
      if (this.PrinterStatus == "BUILDING_FROM_SD") {
        this.IsPrinting = true;
      }
      else {
        this.IsPrinting = false;
      }
      this.PrintStateLoaded = true;
    }
    catch (e) {
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
  public Disconnect(): void {
    this.printerService.Disconnect();
  }

  /**
    * Opens the confirmation dialog to stop printing.
    */
  public OpenStopPrintingDialog(): void {
    // Open the confirmation dialog and prevent soft dismissing
    const diafRef = this.dialog.open(StoprPrintingConfirmationDialogComponent);
    diafRef.disableClose = true;
  }

  /**
   * Pauses the printing.
   */
  public PausePrinting(): void {
    try {
      this.printerService.PausePrintingAsync();
    } catch (error) {
      ErrorLogger.NonFatalError(error);
    }
  }

  /**
   * Resumes the printing.
   */
  public ResumePrinting(): void {
    try {
      this.printerService.ResumePrintingAsync();
    } catch (error) {
      ErrorLogger.NonFatalError(error);
    }
  }

  /**
  * Invoked when the Angular component is destroyed.
  */
  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }
}
