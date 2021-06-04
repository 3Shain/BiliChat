import React from 'react';
import ReactDom from 'react-dom';
import { KairoApp } from '@kairo/react';
import DeltaView from './view';
import css from '!!to-string-loader!css-loader?esModule=false!sass-loader!./styles.scss';

export function setupDelta(root: ShadowRoot, diInit: () => void) {

    const container = root.querySelector('body').appendChild(document.createElement('delta-root'));
    const styleElement = document.createElement('style');
    styleElement.textContent = css;
    root.querySelector('head').appendChild(styleElement);

    ReactDom.render(
        <KairoApp globalSetup={diInit}>
            <DeltaView />
        </KairoApp>,
        container
    );

    return ()=>ReactDom.unmountComponentAtNode(container);
}
