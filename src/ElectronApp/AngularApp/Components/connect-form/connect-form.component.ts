import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-connect-form',
  templateUrl: './connect-form.component.html',
  styleUrls: ['./connect-form.component.css']
})
export class ConnectFormComponent implements OnInit {

  public isError: boolean;
  public PrinterAddress: string;
  ngOnInit(): void {

  }

  public async connect(){
    try{
      console.log(this.PrinterAddress);
      window["PrinterService"].ConnectAsync(this.PrinterAddress);
    }
    catch {
      this.isError = true;
    }

  } 

}
