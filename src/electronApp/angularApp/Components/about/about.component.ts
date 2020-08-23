import { Component, OnInit } from '@angular/core';
const {app} = window.require('electron').remote;

/**
 * Component for the app About page.
 */
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  /**
   * Gets the app version number.
   */
  public Version: string;

  /**
   * Initializes a new instance of the AboutComponent class.
   */
  constructor() {
    this.Version = app.getVersion();
  }

  /**
   * Invoked when the Angular component is initialized.
   */
  ngOnInit(): void {
  }
}
