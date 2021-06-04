import { Observable, OperatorFunction } from 'rxjs';

export function waitTimeout(time:number){
    return new Promise((res)=>{
        setTimeout(res,time);
    })
}

export function waitUntilVisible<T>(): OperatorFunction<T, T> {
    return (upstream) => {
        return new Observable(observer => {
            return upstream.subscribe({
                next(x) {
                    if (document.visibilityState == 'visible') {
                        observer.next(x);
                        return;
                    }
                    const teardown = registerVisibilityChange(v => {
                        v && observer.next(x), teardown();
                    });
                },
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer)
            })
        })
    }
}

export function waitUntilPageVisible(): Promise<void> {
    return new Promise((res)=>{
        if(document.visibilityState=='visible'){
            res();
        } else {
            const teardown = registerVisibilityChange(v=>{
                if(v){
                    res();
                    teardown();
                }
            })
        }
    });
}

export function registerVisibilityChange(cb: (visible: boolean) => unknown) {
    // eslint-disable-next-line
    if ((window as any).obsstudio) {
        const handler = (ev: CustomEvent) => {
            cb(ev.detail.visible);
        }
        window.addEventListener('obsSourceVisibleChanged', handler);
        return () => {
            document.removeEventListener('obsSourceVisibleChanged', handler);
        }
    } else {
        const handler = () => {
            cb(document.visibilityState === 'visible');
        };
        document.addEventListener('visibilitychange', handler);
        return () => {
            document.removeEventListener('visibilitychange', handler);
        }
    }
}

export function nextFrame() {
    return new Promise<number>((res) => {
        requestAnimationFrame(res);
    });
}