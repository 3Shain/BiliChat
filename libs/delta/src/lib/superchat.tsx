import { RichText } from '@comen/common';
import { withKairo } from '@kairo/react';
import React from 'react';

interface SuperchatProps {
    content: string;
    username: string;
    avatar: string;
    
}

export default withKairo<SuperchatProps>(() => {

    return () => <div>

    </div>;
});
