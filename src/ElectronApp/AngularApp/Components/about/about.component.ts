import { Component, OnInit } from '@angular/core';
const {app} = window.require('electron').remote

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
}
