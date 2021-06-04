import { RichText } from '@comen/common';
import { withKairo } from '@kairo/react';
import React from 'react';

interface MembershipProps {
    content: string;
    username: string;
    avatar: string;
    
}

export default withKairo<MembershipProps>(() => {

    return () => <div>

    </div>;
});
