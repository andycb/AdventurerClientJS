import { Component, OnInit } from '@angular/core';
import { PrinterServiceWrapperService } from "../../Services/printer-service-wrapper.service" 
import { ErrorLogger } from 'ElectronApp/Core/ErrorLogger';
import { Router } from '@angular/router';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  PrinterStatus: string;
  Endstop: string;
  BuildVolume: string;
  FirmwareVersion: string;
  SerialNumber: string;
  PrinterName: string;
  BuildPlateTemp: string;
  Tool0Temp: string;

 
  constructor(private printerService: PrinterServiceWrapperService, private router: Router) { }

  private async UpdateStatusText(){
    try{
      var status = await this.printerService.GetPrinterStatusAsync();
      this.PrinterStatus = status.MachineStatus;
      this.Endstop = status.Endstop.X.toString() + "," + status.Endstop.Y.toString() + "," + status.Endstop.Z.toString();

      var firmwareInfo = await this.printerService.GetFirmwareVersionAsync();
      this.FirmwareVersion = firmwareInfo.FirmwareVersion;
      this.SerialNumber = firmwareInfo.SerialNumber;
      this.PrinterName = firmwareInfo.MachineType;
      this.BuildVolume = firmwareInfo.BuildVolume.X.toString() + "," + firmwareInfo.BuildVolume.Y.toString() + "," + firmwareInfo.BuildVolume.Z.toString();

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

    setInterval(() => {
      this.UpdateStatusText();
    }, 2000);
  }

  dosconnect(){
    this.printerService.Disconnect();
    this.router.navigate(['/']);
  }


}
