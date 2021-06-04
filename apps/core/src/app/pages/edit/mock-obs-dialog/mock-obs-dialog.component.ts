import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'comen-mock-obs-dialog',
  templateUrl: './mock-obs-dialog.component.html',
  styleUrls: ['./mock-obs-dialog.component.scss']
})
export class MockObsDialogComponent implements OnInit {

  @Input() cssInfo: string;

  @Input() url: string;

  @Input() size: [number, number] = [800, 600];

  @ViewChild('view', { static: true }) view: ElementRef<HTMLDivElement>;
  @ViewChild('container', { static: true }) container: ElementRef<HTMLDivElement>;

  clickCss(event: Event) {
    (event.target as HTMLTextAreaElement).select();
    document.execCommand('copy');
  }

  ngOnInit() {
    const rect = this.view.nativeElement.getBoundingClientRect();
    const ratio = rect.width / this.size[0];
    const ratio2 = rect.height / this.size[1];
    if (this.size[0] > this.size[1]) {
      this.container.nativeElement.style.transform = `scale(${ratio}) translateY(${(rect.height - ratio * this.size[1]) / ratio / 2}px)`;
      this.container.nativeElement.style.transformOrigin = `left top`;
    } else {
      this.container.nativeElement.style.transform = `scale(${ratio2}) translateX(${(rect.width - ratio2 * this.size[0]) / ratio2 / 2}px)`;
      this.container.nativeElement.style.transformOrigin = `left top`;
    }
  }
}
