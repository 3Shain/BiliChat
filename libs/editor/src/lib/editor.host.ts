import { Injectable } from '@angular/core';
import { ComenEnvironmentHost, Message, SafeAny } from '@comen/common';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

@Injectable()
export class EditorEnvironmentHost extends ComenEnvironmentHost {

    constructor() {
        super();
    }

    private message$: Subject<Message> = new Subject();

    message() {
        return this.message$;
    }

    emitMessage(message: Message) {
        this.message$.next(message);
    }

    private configMap: {
        [key: string]: Subject<SafeAny>;
    } = {};

    config(section: string) {
        if (!this.configMap[section]) {
            this.configMap[section] = new ReplaySubject(1);
        }
        return this.configMap[section];
    }

    emitConfig(section: string, value: SafeAny) {
        if (!this.configMap[section]) {
            this.configMap[section] = new BehaviorSubject(value);
            return;
        }
        this.configMap[section].next(value);
    }

    private variantPipeMap: {
        [key: string]: Subject<SafeAny>;
    } = {};

    variantPipe(section: string) {
        if (!this.variantPipeMap[section]) {
            this.variantPipeMap[section] = new ReplaySubject(1);
        }
        return this.variantPipeMap[section];
    }

    emitVariantPipe(section: string, value: SafeAny) {
        if (!this.variantPipeMap[section]) {
            this.variantPipeMap[section] = new BehaviorSubject(value);
        }
        this.variantPipeMap[section].next(value);
    }

    assetUrl(id: string) {
        return '';
    }
}