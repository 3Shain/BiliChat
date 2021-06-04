import { Pipe, ChangeDetectorRef, PipeTransform } from '@angular/core';
import { parse, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { AsyncPipe } from '@angular/common';
import { timer, Observable } from 'rxjs';
import { tap, map, distinctUntilChanged, startWith } from 'rxjs/operators';

@Pipe({
    name: 'timeAgo',
    pure: false,
})
export class TimeAgoPipe extends AsyncPipe implements PipeTransform {

    private time: Date;
    private formatted$: Observable<string>;

    constructor(private cd: ChangeDetectorRef) {
        super(cd);

        this.formatted$ = timer(0, 5000).pipe(
            map(() => formatDistanceToNow(this.time, { addSuffix: true, includeSeconds: true,locale: zhCN })),
            distinctUntilChanged()
        );
    }

    public transform(value: any): any {
        this.time = new Date(value);
        return super.transform(this.formatted$);
    }

}