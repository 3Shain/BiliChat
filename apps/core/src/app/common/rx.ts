import { Observable, OperatorFunction } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';

/**
 * For one trial observable
 * @param abort 
 */
export function abortable<T>(abort: AbortController): OperatorFunction<T, T> {
    return (upstream) => {
        return new Observable((observer) => {
            const handler = () => {
                unsub.unsubscribe();
                observer.error('ABORTED');
                abort.signal.removeEventListener('abort', handler);
            }
            const unsub = upstream.subscribe({
                next: (v) => {
                    observer.next(v);
                },
                error: (e) => {
                    observer.error(e);
                },
                complete: () => {
                    observer.complete();
                    abort.signal.removeEventListener('abort', handler);
                }
            });
            abort.signal.addEventListener('abort', handler);
        });
    }
}

@Injectable()
export class RxZone {

    constructor(private zone: NgZone) { }

    subscribeOutsideAngular<T>(): OperatorFunction<T, T> {
        return (source) => {
            return new Observable((observer) => {
                return this.zone.runOutsideAngular(() => source.subscribe(observer));
            });
        }
    }
}