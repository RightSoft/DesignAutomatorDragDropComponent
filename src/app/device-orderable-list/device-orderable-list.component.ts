import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {fabric} from "fabric";
import {IDragObjectOptions} from "./components/IDragObjectOptions";
import {DragObject} from "./components/dragObject";
import {ICanvasOptions} from "fabric/fabric-impl";
import {DnaDevice} from "./model/dnaDevice";

@Component({
  selector: 'app-device-orderable-list',
  templateUrl: './device-orderable-list.component.html',
  styleUrls: ['./device-orderable-list.component.css']
})
export class DeviceOrderableListComponent implements AfterViewInit {

  @ViewChild('canvasContainer', {static: true}) canvasContainer: ElementRef<HTMLElement>;
  private canvas: fabric.Canvas = null;

  @Input()
  public dragObjectOptions: IDragObjectOptions;

  @Output()
  public deviceListUpdated:EventEmitter<Array<DnaDevice>> = new EventEmitter();

  @Input()
  public deviceList: Array<DnaDevice>;

  @HostListener("window:resize", ["$event"])
  onWindowResize(event) {
    this.resizeCanvas();
  }

  private onMouseDownHandler = (event) => { this.onMouseDown(event) };
  private onMouseMoveHandler = (event) => { this.onMouseMove(event) };
  private onMouseUpHandler = (event) => { this.onMouseUp(event) };
  private _dragObjectProjection: DragObject;
  private _dragStartIndex:number;

  private _totalColumnCount = 0;
  private _totalRowCount = 0;
  private _mouseOffsetX:number;
  private _mouseOffsetY:number;
  private dragObjectList: Array<DragObject> = [];

  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas('deviceHolder', <ICanvasOptions>{backgroundColor: '#cccccc', selection:false});
    this.canvas.on('mouse:move',this.onMouseMoveHandler);
    this.canvas.on('mouse:up',this.onMouseUpHandler);
    this.canvas.on('mouse:down',this.onMouseDownHandler);
    this.initializeItems();
    this.resizeCanvas();
  }

  private resizeCanvas() {
    this.canvas.setWidth(this.canvasContainer.nativeElement.offsetWidth);
    this.orderItems();
    var height = this.dragObjectOptions.dragObjectHeight * this._totalRowCount;
    this.canvasContainer.nativeElement.style.height = height+"px";
    this.canvas.setHeight(this.canvasContainer.nativeElement.offsetHeight);
  }

  private initializeItems() {

    if(this.dragObjectOptions == null){
      this.dragObjectOptions = <IDragObjectOptions>{dragObjectWidth:100, dragObjectHeight:100, dragObjectSpacing:5};
    }

    for (const device of this.deviceList) {
      let dragObject = new DragObject(device, this.dragObjectOptions);
      dragObject.needsRedraw.subscribe(() => {
        this.canvas.requestRenderAll();
      });

      this.canvas.add(dragObject);
      dragObject.init();

      this.dragObjectList.push(dragObject);
    }

    if(this.dragObjectOptions != null)
      this.orderItems();
    this.canvas.requestRenderAll();
  }

  private onDelete(targetObj)
  {
    this.canvas.remove(targetObj);
    this.deviceList = this.deviceList.filter(obj => obj !== targetObj.device);
    this.dragObjectList = this.dragObjectList.filter(obj => obj !== targetObj);

    targetObj = null;
    this.orderItems();
  }

  private orderItems() {

    this._totalColumnCount = 0;
    this._totalRowCount = 0;
    const maxWidth = this.canvas.getWidth();
    const maxHeight = this.canvas.getHeight();

    const columnCount = Math.floor(maxWidth / (this.dragObjectOptions.dragObjectWidth));
    let xPos = 0;
    let yPos = 0;

    for (let i = 0; i < this.dragObjectList.length; i++) {
      let x = xPos;
      let y = yPos;
      if (xPos+1 >= columnCount) {
        xPos = 0;
        yPos += 1;
        this._totalRowCount = Math.max(yPos, this._totalRowCount)
      }else{
        xPos += 1;
        this._totalColumnCount = Math.max(xPos, this._totalColumnCount)
      }

      this.dragObjectList[i].left = x * this.dragObjectOptions.dragObjectWidth;
      this.dragObjectList[i].top  = y * this.dragObjectOptions.dragObjectHeight;
      this.dragObjectList[i].setCoords();
      this.dragObjectList[i].setObjectsCoords();
    }

    // one more than max index
    this._totalRowCount += 1;
    this._totalColumnCount += 1;
    this.canvas.requestRenderAll();

    this.deviceListUpdated.emit(this.deviceList);
  }

  private onMouseDown(event: any) {

    var position = this.canvas.getPointer(event.e);
    var target = this.getTargetFromPosition(position);

    if(target.checkIfMouseIsOnDeleteButton(position)){
      // can popup a warning for delete
      this.onDelete(target);
      return;
    }

    if(target != null){
      this._mouseOffsetX = position.x - target.left;
      this._mouseOffsetY = position.y - target.top;
      this._dragObjectProjection = fabric.util.object.clone(target);
      this._dragObjectProjection.device = target.device;
      target.opacity = 0.3;

      this.canvas.add(this._dragObjectProjection);
      this._dragStartIndex = this.deviceList.indexOf(target.device);

    }else{
      console.log(event.target);
    }
  }

  private onMouseMove(event: any) {

    var position = this.canvas.getPointer(event.e);

    if(this._dragObjectProjection != null){
      this._dragObjectProjection.left = position.x - this._mouseOffsetX;
      this._dragObjectProjection.top = position.y - this._mouseOffsetY;
      //
      var column = Math.max(0,Math.min(Math.round(this._dragObjectProjection.left / this.dragObjectOptions.dragObjectWidth), this._totalColumnCount));
      var row = Math.max(0,Math.min(Math.round(this._dragObjectProjection.top / this.dragObjectOptions.dragObjectHeight), this._totalRowCount));
      let index = this.columnRowToIndex(row,column);

      if(this._dragStartIndex != index){
        this.arrayMove(this.dragObjectList, this._dragStartIndex, index);
        this.arrayMove(this.deviceList, this._dragStartIndex, index);
        this.orderItems();

        this._dragStartIndex = index;
        this.dragObjectList.forEach(value => value.calcCoords());
        console.log(this.deviceList);
      }
      this.canvas.requestRenderAll();
    }else{
      var position = this.canvas.getPointer(event.e);
      var target = this.getTargetFromPosition(position);

      if(target.checkIfMouseIsOnDeleteButton(position)){
       this.canvas.setCursor('pointer');
      }else{
        this.canvas.setCursor('auto');
      }
    }
  }

  private onMouseUp(event:any){

    if(this._dragObjectProjection!=null){
      this.canvas.remove(this._dragObjectProjection);
      this._dragObjectProjection = null;
      this.dragObjectList.forEach(value => value.opacity = 1.0);
    }
  }

  private arrayMove (arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  };

  private columnRowToIndex(row:number, column:number):number {
    var index = 0;
    if(row > 0) {
      index = Math.min((row * this._totalColumnCount)+column , this.deviceList.length -1);
    }else {
      index = column;
    }

    return index;
  }


  private getTargetFromPosition(position: { x: number; y: number }) {
    var target:DragObject;
    for (const dragObject of this.dragObjectList) {
      var rect = dragObject.getBoundingRect();
      if(position.x >= rect.left && position.x <= rect.left + rect.width && position.y >= rect.top && position.y <= rect.top + rect.height){
        target = dragObject;
        break;
      }
    }
    return target;
  }
}
