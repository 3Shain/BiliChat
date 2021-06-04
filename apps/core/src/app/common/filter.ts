import { Observable, OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TextMessage, Message } from '@comen/common';
import { nextAnimationFrame, task } from 'kairo';

export function commentFilter(config: {
    userBlacklist: number[];
    wordBlacklist: string[];
    minGiftValue: number;
    levelFilter: number;
    typeFilterControlBit: number;
}): OperatorFunction<Message, Message> {
    return (upstream) =>
        upstream.pipe(
            filter((comment) => {
                if ('platformUserId' in comment) {
                    if (
                        config.userBlacklist.indexOf(comment.platformUserId) !=
                        -1
                    ) {
                        return false;
                    }
                }
                if ('content' in comment) {
                    if (
                        config.wordBlacklist.some((s) => {
                            return comment.content.indexOf(s) != -1;
                        })
                    ) {
                        return false;
                    }
                }
                if (
                    config.levelFilter > 0 &&
                    'platformUserLevel' in comment &&
                    comment.platformUserLevel < config.levelFilter
                ) {
                    return false;
                }
                if ('price' in comment && comment.price < config.minGiftValue) {
                    return false;
                }
                if (
                    comment.type == 'text' &&
                    config.typeFilterControlBit & 0b1
                ) {
                    return false;
                }
                if (
                    comment.type == 'sticker' &&
                    config.typeFilterControlBit & 0b10
                ) {
                    return false;
                }
                if (
                    comment.type == 'paid' &&
                    config.typeFilterControlBit & 0b100
                ) {
                    return false;
                }
                if (
                    comment.type == 'member' &&
                    config.typeFilterControlBit & 0b1000
                ) {
                    return false;
                }
                return true;
            })
        );
}

export function smoother(config: {
    disableSmoother: boolean;
}): OperatorFunction<Message, Message> {
    return (upstream) => {
        if (config.disableSmoother) {
            return upstream;
        }
        return new Observable((observer) => {
            const messageBuffer = [] as TextMessage[];
            const startedTask = task(function* () {
                while (true) {
                    if (messageBuffer.length) {
                        observer.next(messageBuffer.shift());
                        const time = performance.now();
                        for (
                            let i = 0;
                            i < 12 - messageBuffer.length * 0.4 /* pressure */;
                            i++
                        ) {
                            yield* nextAnimationFrame();
                        }
                    }
                    yield* nextAnimationFrame();
                }
            })();

            return upstream
                .subscribe((comment) => {
                    if (comment.type == 'text') {
                        messageBuffer.push(comment);
                    } else {
                        // ignore non text comment
                        observer.next(comment);
                    }
                })
                .add(() => {
                    startedTask.cancel();
                });
        });
    };
}

export function folder(config: {
    groupSimilar: boolean;
    groupSimilarWindow: number;
}): OperatorFunction<Message, Message> {
    return (upstream) => {
        if (!config.groupSimilar) {
            return upstream;
        }
        return new Observable((observer) => {
            return upstream.subscribe((comment) => {
                if (comment.type === 'text') {
                    // folding logic
                    observer.next(comment);
                } else {
                    // ignore non text comment
                    observer.next(comment);
                }
            });
        });
    };
}
