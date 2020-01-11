export class DnaDevice {
  deviceName: string;
  svgIcon: string;

  constructor(name: string, iconUrl: string) {
    this.deviceName = name;
    this.svgIcon = iconUrl;
  }
}
