import { RichText } from '@comen/common';
import { withKairo } from '@kairo/react';
import React from 'react';

interface TextProps {
    content: string | RichText;
    username: string;
    avatar: string;
}

export default withKairo<TextProps>(({
    avatar,
    username,
    content
}) => {

    return () => <div id="text-message">
        <div id="avatar">
            <div>
                <img style={{
                    height: '24px',
                    width: '24px',
                }}
                src={avatar}/>
            </div>
        </div>
        <div id="user">
            {username}
        </div>
        <div></div>
        <div id="content">
            {content}
        </div>
    </div>;
});
