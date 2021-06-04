import {
    Type,
    ɵComponentDef as ComponentDef,
    ɵɵdirectiveInject,
    ɵɵProvidersFeature,
    NgZone,
    InjectFlags,
    ChangeDetectorRef,
    Injector,
    SimpleChanges,
    Provider,
} from '@angular/core';
import { mutable, transaction, isBehavior, action, Scope, effect } from 'kairo';
import { ScopeRef, KairoScopeRefImpl } from './kairo.service';

export function WithKairo(obj?: {
    /**
     * Configures the [injector](guide/glossary#injector) of this
     * directive or component with a [token](guide/glossary#di-token)
     * that maps to a [provider](guide/glossary#provider) of a dependency.
     */
    providers?: Provider[];
    /**
     * Defines the set of injectable objects that are visible to its view DOM children.
     * See [example](#injecting-a-class-with-a-view-provider).
     *
     */
    viewProviders?: Provider[];
}) {
    return <T>(componentType: Type<T>) => {
        const componentDef = componentType['ɵcmp'] as ComponentDef<unknown>;
        const originFac = componentType['ɵfac'];
        componentType['ɵfac'] = (...args: any) => {
            const origin = originFac(...args);
            origin['__kairo_parent_scope__'] = ɵɵdirectiveInject(
                KairoScopeRefImpl,
                InjectFlags.SkipSelf
            );
            origin['__kairo_scope__'] = ɵɵdirectiveInject(
                KairoScopeRefImpl,
                InjectFlags.Self
            );
            origin['__injector__'] = ɵɵdirectiveInject(
                Injector,
                InjectFlags.Self
            );
            origin['__zone__'] = ɵɵdirectiveInject(NgZone);
            origin['__init__'] = false;
            origin['__changesHook__'] = [];
            return origin;
        };
        const features = [
            ɵɵProvidersFeature(
                [
                    {
                        provide: KairoScopeRefImpl,
                        useClass: KairoScopeRefImpl,
                    },
                    {
                        provide: ScopeRef,
                        useExisting: KairoScopeRefImpl,
                    },
                    ...(obj?.providers ?? []),
                ],
                [...(obj?.viewProviders ?? [])]
            ),
            (def: ComponentDef<unknown>) => {
                (def.onPush as any) = true;

                const hasInputs = Object.keys(componentDef.inputs).length > 0;

                // ensure these method exist in prototype cuz ivy will store them.
                const originNgOnChanges = (hasInputs
                    ? def.type.prototype.ngOnChanges
                    : def.type.prototype.ngOnInit) as Function;
                const originNgOnDestroy = def.type.prototype
                    .ngOnDestroy as Function;
                def.type.prototype.ngOnDestroy = function (this: {
                    __zone__: NgZone;
                    __kairo_detach__: Function;
                }) {
                    this.__zone__.runOutsideAngular(() => {
                        this.__kairo_detach__();
                    });
                    originNgOnDestroy?.call(this);
                };

                const onChangesOrOnInit = function (
                    this: {
                        __kairo_parent_scope__: KairoScopeRefImpl;
                        __kairo_scope__: KairoScopeRefImpl;
                        __injector__: Injector;
                        __zone__: NgZone;
                        ngSetup: Function;
                        __init__: boolean;
                        __changesHook__: Function[];
                    },
                    changes: SimpleChanges
                ) {
                    if (!this.__init__) {
                        if (typeof this.ngSetup !== 'function') {
                            console.error(`ngSetup is not declared.`);
                            return;
                        }
                        const changeDetector = this.__injector__.get(
                            ChangeDetectorRef
                        );
                        this.__zone__.runOutsideAngular(() => {
                            const scope = new Scope(() => {
                                const resolve = this.ngSetup(
                                    (thunk: Function) => {
                                        const [beh, setbeh] = mutable(
                                            thunk(this)
                                        );
                                        this.__changesHook__.push(
                                            (instance: unknown) => {
                                                setbeh(thunk(instance));
                                            }
                                        );
                                        return beh;
                                    }
                                );
                                if (resolve === undefined) {
                                    return {};
                                }
                                if (typeof resolve != 'object') {
                                    throw Error(
                                        `ngSetup() is expected to return an object, but it got ${typeof resolve}`
                                    );
                                }
                                for (const [key, value] of Object.entries(
                                    resolve
                                )) {
                                    if (isBehavior(value)) {
                                        effect(() =>
                                            value.watch((v) => {
                                                this[key] = v;
                                                changeDetector.detectChanges();
                                            })
                                        );
                                        resolve[key] = value.value;
                                    } else if (typeof value === 'function') {
                                        resolve[key] = action(value as any);
                                    }
                                }
                                return resolve;
                            }, this.__kairo_parent_scope__.scope);
                            this.__kairo_scope__.scope = scope;
                            Object.assign(this, scope.exported);

                            this['__kairo_detach__'] = scope.attach();
                        });
                        this.__kairo_scope__.__initialize();
                        this.__init__ = true;
                    } else {
                        this.__zone__.runOutsideAngular(() => {
                            transaction(() => {
                                this.__changesHook__.forEach((x) => x(this));
                            });
                        });
                    }
                    originNgOnChanges?.apply(this, changes);
                };

                if (hasInputs)
                    def.type.prototype.ngOnChanges = onChangesOrOnInit;
                else def.type.prototype.ngOnInit = onChangesOrOnInit;
            },
        ];
        features.forEach((x) => x(componentDef));
    };
}
