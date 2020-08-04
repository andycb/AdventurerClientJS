import { Component, OnInit } from '@angular/core';
import { PrinterServiceWrapperService } from "../../Services/printer-service-wrapper.service" 
import { ErrorLogger } from 'ElectronApp/Core/ErrorLogger';
import { stat } from 'fs';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  PrinterStatus: string;
  EndstopX: string;
  EndstopY: string;
  EndstopZ: string;
  BuildVolumeX: string;
  BuildVolumeY: string;
  BuildVolumeZ: string;
  FirmwareVersion: string;
  SerialNumber: string;
  PrinterName: string;
  BuildPlateTemp: string;
  Tool0Temp: string;

  constructor(private printerService: PrinterServiceWrapperService) { }

  private async UpdateStatusText(){
    try{
      var status = await this.printerService.GetPrinterStatusAsync();
      this.PrinterStatus = status.MachineStatus;
      this.EndstopX = status.Endstop.X.toString();
      this.EndstopY = status.Endstop.Y.toString();
      this.EndstopZ = status.Endstop.Z.toString();

      var firmwareInfo = await this.printerService.GetFirmwareVersionAsync();
      this.FirmwareVersion = firmwareInfo.FirmwareVersion;
      this.SerialNumber = firmwareInfo.SerialNumber;
      this.PrinterName = firmwareInfo.MachineType;
      this.BuildVolumeX = firmwareInfo.BuildVolume.X.toString();
      this.BuildVolumeY = firmwareInfo.BuildVolume.Y.toString();
      this.BuildVolumeZ = firmwareInfo.BuildVolume.Z.toString();

      var temp = await this.printerService.GetTemperatureAsync();
      this.Tool0Temp = temp.Tool0Temp.toString();
      this.BuildPlateTemp = temp.BuildPlateTemp.toString();
    }
    catch(e){
      ErrorLogger.NonFatalError(e);
    }
  }

  ngOnInit(): void {
    this.UpdateStatusText();
  }



}
