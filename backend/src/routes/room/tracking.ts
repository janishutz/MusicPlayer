import corsManager from '../../corsManager';
import express from 'express';
import {
    getLoginSdk
} from '../../sdk';
import rooms from '../../manager/rooms';
import {
    sseMiddleware
} from '../../manager/rooms/sse';

const tackingUpdate = ( message: string ) => {
    return ( request: express.Request, response: express.Response ) => {
        if ( typeof request.params.id === 'string' ) {
            if ( rooms.sendTrackingUpdate( request.params.id, message ) )
                response.sendStatus( 200 );
            else
                response.sendStatus( 500 );
        } else
            response.sendStatus( 400 );
    };
};

const routes = ( app: express.Application, foss: boolean ) => {
    const sdk = getLoginSdk( foss );

    app.get(
        '/room/:id/tracking/exit',
        corsManager.middleware( false ),
        tackingUpdate( 'exit' )
    );

    app.get(
        '/room/:id/tracking/ping',
        corsManager.middleware( false ),
        tackingUpdate( 'ping' )
    );

    app.get(
        '/room/:id/admin',
        corsManager.middleware( false ),
        sdk.loginCheck(),
        sseMiddleware( 'trackingClient' )
    );
};

export default {
    routes
};
