import {
    Config
} from '../../dtype/config';
import express from 'express';
import {
    getLoginSdk
} from '../../sdk';
import {
    getOwnershipManager
} from '../../manager/users/ownership';
import rooms from '../../manager/rooms';
import tracking from './tracking';
import update from './update';

const routes = ( app: express.Application, foss: boolean, config: Config ) => {
    const sdk = getLoginSdk( foss );
    const ownership = getOwnershipManager( foss );

    tracking.routes( app, foss );
    update.routes( app, foss, config );

    app.get(
        '/room/create',
        sdk.loginCheck(),
        ownership.middleware(),
        ( request: express.Request, response: express.Response ) => {
            if ( !request.query.room || !( /^[a-zA-Z0-9-]{3,20}/ ).test( String( request.query.room ) ) ) return response.sendStatus( 400 );

            if ( rooms.create( String( request.query.room ), sdk.getUID( request )! ) )
                response.sendStatus( 200 );
            else
                response.sendStatus( 409 );
        }
    );

    app.get(
        '/room/:id/close',
        sdk.loginCheck(),
        ( request: express.Request, response: express.Response ) => {
            if ( typeof request.params.room !== 'string' ) return response.sendStatus( 400 );

            if ( rooms.close( String( request.query.room ), sdk.getUID( request )! ) )
                response.sendStatus( 200 );
            else
                response.sendStatus( 500 );
        }
    );
};

export default {
    routes
};
