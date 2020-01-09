import {Component, HostListener, ViewChild, ElementRef, AfterViewInit, Input} from '@angular/core';

import {IDragObjectOptions} from "./device-orderable-list/components/IDragObjectOptions";
import {Device} from "./device-orderable-list/model/Device";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent  {

  public deviceList: Array<Device> = [
    new Device("1", "assets/icons/1.svg"),
    new Device("2", "assets/icons/2.svg"),
    new Device("3", "assets/icons/3.svg"),
    new Device("4", "assets/icons/4.svg"),
    new Device("5", "assets/icons/5.svg"),
    new Device("6", "assets/icons/6.svg"),
    new Device("7", "assets/icons/7.svg"),
    new Device("8", "assets/icons/8.svg"),
    new Device("1", "assets/icons/1.svg"),
    new Device("2", "assets/icons/2.svg"),
    new Device("3", "assets/icons/3.svg"),
    new Device("4", "assets/icons/4.svg"),
    new Device("5", "assets/icons/5.svg"),
    new Device("6", "assets/icons/6.svg"),
    new Device("7", "assets/icons/7.svg"),
    new Device("8", "assets/icons/8.svg")
  ];

  public dragObjectOptions:IDragObjectOptions = <IDragObjectOptions>{dragObjectWidth:100, dragObjectHeight:100, dragObjectSpacing:5};

}

