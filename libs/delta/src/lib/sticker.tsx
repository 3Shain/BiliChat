import { RichText } from '@comen/common';
import { withKairo } from '@kairo/react';
import React from 'react';

interface StickerProps {
    content: string;
    username: string;
    avatar: string;
    
}

export default withKairo<StickerProps>(() => {

    return () => <div>

    </div>;
});
