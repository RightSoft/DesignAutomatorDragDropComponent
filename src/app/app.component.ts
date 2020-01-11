import {Component, HostListener, ViewChild, ElementRef, AfterViewInit, Input} from '@angular/core';

import {IDragObjectOptions} from "./device-orderable-list/components/IDragObjectOptions";
import {DnaDevice} from "./device-orderable-list/model/dnaDevice";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent  {

  public deviceList: Array<DnaDevice> = [
    new DnaDevice("1", "assets/icons/1.svg"),
    new DnaDevice("2", "assets/icons/2.svg"),
    new DnaDevice("3", "assets/icons/3.svg"),
    new DnaDevice("4", "assets/icons/4.svg"),
    new DnaDevice("5", "assets/icons/5.svg"),
    new DnaDevice("6", "assets/icons/6.svg"),
    new DnaDevice("7", "assets/icons/7.svg"),
    new DnaDevice("8", "assets/icons/8.svg"),
    new DnaDevice("1", "assets/icons/1.svg"),
    new DnaDevice("2", "assets/icons/2.svg"),
    new DnaDevice("3", "assets/icons/3.svg"),
    new DnaDevice("4", "assets/icons/4.svg"),
    new DnaDevice("5", "assets/icons/5.svg"),
    new DnaDevice("6", "assets/icons/6.svg"),
    new DnaDevice("7", "assets/icons/7.svg"),
    new DnaDevice("8", "assets/icons/8.svg")
  ];

  public dragObjectOptions:IDragObjectOptions = <IDragObjectOptions>{dragObjectWidth:100, dragObjectHeight:100, dragObjectSpacing:5};

}

