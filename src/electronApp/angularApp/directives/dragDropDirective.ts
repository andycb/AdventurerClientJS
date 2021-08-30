import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';

/**
 * Directive to add cSS class to a HTML element when an object is dragged onto it.
 */
@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {
  /**
   * Event raised when a file is dropped onto he element.
   */
  @Output() FileDropped = new EventEmitter<any>();

  @HostBinding('class')
  elementClass = '';

  /**
   * Event handler for when the element is dragged onto.
   * @param evt The event args.
   */
  @HostListener('dragover', ['$event']) onDragOver(evt): void {
    evt.preventDefault();
    evt.stopPropagation();

    // Add CSS class to element
    this.elementClass = 'dragOver';
  }

  /**
   * Event handler for when the element is dragged off.
   * @param evt The event args.
   */
  @HostListener('dragleave', ['$event']) public onDragLeave(evt): void {
    evt.preventDefault();
    evt.stopPropagation();

    // Remove CSS class from element
    this.elementClass = '';
  }

  /**
   * Event handler for when an object is dropped onto the element.
   * @param evt The event args
   */
  @HostListener('drop', ['$event']) public ondrop(evt): void {
    evt.preventDefault();
    evt.stopPropagation();

      // Remove CSS class from element
      this.elementClass = '';

    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      // If multiple files were dropped, use only the first
      this.FileDropped.emit([files[0]]);
    }
  }
}
