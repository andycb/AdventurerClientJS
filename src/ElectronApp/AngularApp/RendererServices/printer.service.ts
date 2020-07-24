import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {
  private ipc: IpcRenderer;

  constructor() { 
    this.ipc = (<any>window).require('electron').ipcRenderer;
  }

  public async GetIsConnectedAsync() : Promise<Boolean>{
    return this.ipc.invoke("PrinterService", "IsConnected");
  }
  
  public async ConnectAsync(printerIp : string) {
    return this.ipc.invoke("PrinterService", "Connect", printerIp);
  }
}
