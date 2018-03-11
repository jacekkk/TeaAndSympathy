import { Directive, HostListener, Output, EventEmitter, ElementRef } from '@angular/core';

@Directive({
  selector: '[dropZone]'
})
export class DropZoneDirective {

  @Output() dropped =  new EventEmitter<FileList>();

  constructor(private el: ElementRef) { }

  @HostListener('drop', ['$event']) onDrop($event) {
    $event.preventDefault();
    this.dropped.emit($event.dataTransfer.files);
    this.el.nativeElement.className = 'dropzone';
  }

  @HostListener('dragover', ['$event']) onDragOver($event) {
    $event.preventDefault();
    this.el.nativeElement.className = 'dropzone dragover';
  }

  @HostListener('dragleave', ['$event']) onDragLeave($event) {
    $event.preventDefault();
    this.el.nativeElement.className = 'dropzone';
  }
}
