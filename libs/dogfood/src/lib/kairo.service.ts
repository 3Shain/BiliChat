import { Injectable } from '@angular/core';
import {
    Scope,
    inject,
    Behavior,
    Token,
    ExtractBehaviorProperty,
    isBehavior,
    action,
    Factory,
    effect,
} from 'kairo';
import { Observable, ReplaySubject } from 'rxjs';
import { publishReplay, refCount, switchMap } from 'rxjs/operators';

export abstract class ScopeRef {
    public readonly scope: Scope;

    abstract useInject<T>(
        fn: Factory<T>,
        options?: {
            optional?: boolean;
            skipSelf?: boolean;
        }
    ): T extends Behavior<infer C>
        ? Observable<C>
        : Observable<ExtractBehaviorProperty<T>>;
    abstract useInject<T>(
        token: Token<T>,
        options?: {
            optional?: true;
            skipSelf?: boolean;
            defaultValue: T;
        }
    ): T extends Behavior<infer C>
        ? Observable<C>
        : Observable<ExtractBehaviorProperty<T>>;
    abstract useInject<T>(
        token: Token<T>,
        options?: {
            optional?: boolean;
            skipSelf?: boolean;
        }
    ): T extends Behavior<infer C>
        ? Observable<C>
        : Observable<ExtractBehaviorProperty<T>>;
}

@Injectable()
export class KairoScopeRefImpl {
    public scope: Scope;

    constructor() {}

    useInject<T>(
        fn: Factory<T>,
        options?: {
            optional?: boolean;
            skipSelf?: boolean;
        }
    ): T extends Behavior<infer C>
        ? Observable<C>
        : Observable<ExtractBehaviorProperty<T>>;
    useInject<T>(
        token: Token<T>,
        options?: {
            optional?: true;
            skipSelf?: boolean;
            defaultValue: T;
        }
    ): T extends Behavior<infer C>
        ? Observable<C>
        : Observable<ExtractBehaviorProperty<T>>;
    useInject<T>(
        token: Token<T>,
        options?: {
            optional?: boolean;
            skipSelf?: boolean;
        }
    ): T extends Behavior<infer C>
        ? Observable<C>
        : Observable<ExtractBehaviorProperty<T>> {
        return this.init$.pipe(
            switchMap(() => {
                return new Observable<any>((observer) => {
                    const scope = new Scope(() => {
                        const resolve = inject(token, options);
                        if (typeof resolve !== 'object' || resolve === null) {
                            observer.next(resolve);
                            return;
                        }
                        if (isBehavior(resolve)) {
                            observer.next(resolve.value);
                            effect(() =>
                                resolve.watch((x) => observer.next(x))
                            );
                            return;
                        }
                        let expose = {};
                        for (const [key, value] of Object.entries(resolve)) {
                            if (typeof value === 'function') {
                                expose[key] = action(value);
                            } else if (isBehavior(value)) {
                                expose[key] = value.value;
                                effect(() =>
                                    value.watch((updatedValue) => {
                                        expose = {
                                            ...expose,
                                            [key]: updatedValue,
                                        };
                                        observer.next(expose);
                                    })
                                );
                            } else {
                                expose[key] = value;
                            }
                        }
                        observer.next(expose);
                    }, this.scope); // it should be avaliable
                    return scope.attach();
                });
            }),
            publishReplay(1),
            refCount()
        ) as any; // type is a mess
    }

    private init$ = new ReplaySubject<void>(1);

    /**
     * @private
     */
    __initialize() {
        this.init$.next(void 0);
        this.init$.complete();
    }
}
