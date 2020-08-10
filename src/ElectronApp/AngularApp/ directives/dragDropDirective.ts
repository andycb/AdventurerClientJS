import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {
	
  @Output() onFileDropped = new EventEmitter<any>();

  @HostBinding('class')
  elementClass = "";
	
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.elementClass = "dragOver"
  }
	
  //Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.elementClass = ""
  }
	
  //Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit([files[0]])
    }
  }
	
}