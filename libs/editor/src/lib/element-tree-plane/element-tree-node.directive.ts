import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector:'[comen-element-tree-node]'
})
export class ElementTreeNodeDirective {

    @Output('hover') hover:EventEmitter<any> = new EventEmitter();

    @HostListener('mouseover',['$event'])
    onMouseOver(e:MouseEvent){
        e.stopPropagation();
        this.hover.emit();
    }

    @HostListener('mouseleave',['$event'])
    onMouseLeave(e:MouseEvent){
        e.stopPropagation();
    }
}