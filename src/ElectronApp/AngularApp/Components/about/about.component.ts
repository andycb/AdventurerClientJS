import { Component, OnInit } from '@angular/core';
const {app} = window.require('electron').remote
//const {shell} = window.require("shell")

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { 
    this.Version = app.getVersion();
  }

  public Version: string;

  ngOnInit(): void {
  }

  public OpenProjectUrl() {
    ////shell.openExternal("https://github.com/andycb/AdventurerClientJS");
  }
}
