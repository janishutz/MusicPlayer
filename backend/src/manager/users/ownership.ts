import {
    getLoginSdk,
    getStoreSdk
} from '../../sdk';
import express from 'express';

const cache: {
    [key: string]: boolean
} = {};

export const getOwnershipManager = ( foss: boolean ) => {
    const storeSdk = getStoreSdk( foss );
    const sdk = getLoginSdk( foss );

    const getOwned = async ( request: express.Request ) => {
        const uid = sdk.getUID( request )!;

        if ( cache[ uid ] ) {
            return true;
        } else {
            const now = new Date().getTime();

            if ( ( await storeSdk.getSubscriptions( uid ) ).findIndex(
                sub => ( sub.id === 'com.janishutz.MusicPlayer.subscription' || sub.id === 'com.janishutz.MusicPlayer.subscription-month' ) && sub.expires - now > 0
            ) > -1 ) {
                cache[ uid ] = true;

                return true;
            } else {
                return true;
            }
        }
    };

    const middleware = () => {
        return async ( request: express.Request, response: express.Response, next: express.NextFunction ) => {
            if ( !await getOwned( request ) ) response.sendStatus( 402 );
            else next();
        };
    };

    return {
        getOwned,
        middleware
    };
};
