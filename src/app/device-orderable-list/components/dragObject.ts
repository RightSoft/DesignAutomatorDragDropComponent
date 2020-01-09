import {fabric} from 'fabric'
import {Device} from "../model/Device";
import {EventEmitter} from "@angular/core";
import {IGroupOptions, IObjectOptions, IRectOptions, ITextOptions} from "fabric/fabric-impl";
import {IDragObjectOptions} from "./IDragObjectOptions";

export class DragObject extends fabric.Group {
  public deleted: EventEmitter<DragObject> = new EventEmitter();
  public needsRedraw: EventEmitter<any> = new EventEmitter();
  private _label: fabric.Text;
  private _image: fabric.Object;
  private _deleteIcon: fabric.Image;
  private _imageOptions: IGroupOptions;
  private _textOption: ITextOptions = <ITextOptions>{
    fontSize: 12,
    originX: 'left',
    originY: 'top',
    fontFamily: "Helvetica",
    textAlign: "center",
    fontcolor: '#000000',
    height: 20,
    selectable: false,
    evented: false,
    hasControls: false,
    excludeFromExport: true,

  };

  private _deviceOptions: IObjectOptions = <IObjectOptions>{
    hasControls: false,
    selectable: false,
    originX: 'left',
    originY: 'top',
  };

  constructor(public device: Device, private dragObjectOptions: IDragObjectOptions) {
    super([], <IGroupOptions>{
      originX: 'left',
      originY: 'top',
      selectable: false,
      hasControls: false,
      width: dragObjectOptions.dragObjectWidth,
      height: dragObjectOptions.dragObjectHeight
    });
  }

  init() {

    var rect: fabric.Rect = new fabric.Rect(<IRectOptions>{
      width: this.dragObjectOptions.dragObjectWidth,
      height: this.dragObjectOptions.dragObjectHeight,
      evented: true,
      fill: '#ffffff'
    });
    this.addWithUpdate(rect);

    this._imageOptions = <IGroupOptions>{
      originX: 'left',
      originY: 'top',
      evented: false,
      width: this.dragObjectOptions.dragObjectWidth * 0.8,
      height: this.dragObjectOptions.dragObjectHeight * 0.8
    };

    this._textOption.width = this._imageOptions.width;
    this._textOption.top = this.dragObjectOptions.dragObjectHeight - 20;
    fabric.loadSVGFromURL(this.device.iconUrl, results => {
      this._image = fabric.util.groupSVGElements(results);
      var minScale = Math.min(this._imageOptions.width / this._image.width, this._imageOptions.height / this._image.height);
      this._image.scaleX = minScale;
      this._image.scaleY = minScale;
      this._image.calcCoords();
      this._image.left = this.left + this.dragObjectOptions.dragObjectWidth * 0.1;
      this._image.top = this.top;
      this._image.setOptions(this._deviceOptions);
      this.addWithUpdate(this._image);

      if(this._deleteIcon != null){
        this._deleteIcon.bringToFront();
      }
      this.needsRedraw.emit(true);
    });


    fabric.Image.fromURL("assets/icons/trash.png", image => {
      this._deleteIcon = image;
      var minScale = Math.min(20 / this._deleteIcon.width, 20 / this._deleteIcon.height);
      this._deleteIcon.scaleX = minScale;
      this._deleteIcon.scaleY = minScale;
      this._deleteIcon.hoverCursor = "pointer";
      this._deleteIcon.setOptions(this._deviceOptions);
      this._deleteIcon.left = this.left + 2;
      this._deleteIcon.top = this.top + 2;
      this._deleteIcon.calcCoords();
      this.addWithUpdate(this._deleteIcon);
      this.needsRedraw.emit(true);
    });


    this._label = new fabric.Textbox(this.device.name, this._textOption);
    this._label.left = this.dragObjectOptions.dragObjectWidth * 0.1;
    this.addWithUpdate(this._label);
  }

  public checkIfDeleteButtonIsPressed(point:{x,y}){

    let isDeleteIconPressed = point.x > this.left  && point.x < this.left + this._deleteIcon.getScaledWidth() && point.y > this.top && point.y < this.top + this._deleteIcon.getScaledHeight();
    if(isDeleteIconPressed){
      this.deleted.emit(this);
    }
    return isDeleteIconPressed;

  }
}
