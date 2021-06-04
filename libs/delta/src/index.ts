import { ComenAddonMetadata, Message } from '@comen/common';
import { provide, stream } from 'kairo';
import { EVENT_MESSAGE } from './lib/tokens';

const DELTA_METADATA: ComenAddonMetadata = {
    name: 'delta',
    displayName: 'delta',
    editable: true,
    configuration: {
        displayName: 'delta',
        sections: {},
    },
};

export async function preloadDelta() {
    const setup = await import('./lib/delta').then((x) => x.setupDelta);
    registerOverlay(DELTA_METADATA, (instance) => {
        const [messages, emitMessage] = stream<Message>();
        instance.message().subscribe(emitMessage);
        return setup(instance.rootElement, () => {
            provide(EVENT_MESSAGE, messages);
        });
    });
}
