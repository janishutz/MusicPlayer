import {
    Config
} from '../../dtype/config';
import bodyParser from 'body-parser';
import corsManager from '../../corsManager';
import express from 'express';
import {
    getLoginSdk
} from '../../sdk';
import logger from '../../logger';
import rooms from '../../manager/rooms';
import {
    sseMiddleware
} from '../../manager/rooms/sse';

const routes = ( app: express.Application, foss: boolean, config: Config ) => {
    const sdk = getLoginSdk( foss );

    app.get( '/room/:id/connect', corsManager.middleware( false ), sseMiddleware( 'client', config ) );

    app.get( '/room/:id/poll', corsManager.middleware( false ), ( request: express.Request, response: express.Response ) => {
        if ( typeof request.params.id !== 'string' )
            return response.sendStatus( 400 );

        const room = rooms.get( request.params.id );

        if ( !room ) response.sendStatus( 404 );

        const lastRequest = parseInt( String( request.query.last ) ) ?? 0;

        response.send(
            JSON.stringify( {
                'state': room?.state,
                'playlist': ( lastRequest < room!.playlist!.lastUpdate || isNaN( lastRequest ) ) ? room!.playlist.playlist : undefined
            } )
        );
    } );

    app.options( '/room/:id/update/playlist', corsManager.middleware( false ) );
    app.post(
        '/room/:id/update/playlist',
        corsManager.middleware( false ),
        sdk.loginCheck(),
        bodyParser.json(),
        ( request: express.Request, response: express.Response ) => {
            if ( typeof request.params.id !== 'string' )
                return response.sendStatus( 400 );

            try {
                if ( rooms.updatePlaylist(
                    request.params.id,
                    sdk.getUID( request )!,
                    request.body.playlist ?? []
                ) )
                    response.sendStatus( 200 );
                else
                    response.sendStatus( 400 );
            } catch ( err ) {
                logger.error( 'Failed sending updated playlists with error', err );
                response.sendStatus( 500 );
            }
        }
    );

    app.options( '/room/:id/update/state', corsManager.middleware( false ) );
    app.post(
        '/room/:id/update/state',
        corsManager.middleware( false ),
        sdk.loginCheck(),
        bodyParser.json(),
        ( request: express.Request, response: express.Response ) => {
            if ( typeof request.params.id !== 'string' ) {
                return response.sendStatus( 400 );
            }

            try {
                if ( rooms.updateState(
                    request.params.id,
                    sdk.getUID( request )!,
                    request.body.playing ?? false,
                    request.body.index ?? -1,
                    request.body.start ?? new Date().getTime(),
                    request.body.offset ?? 0
                ) )
                    response.sendStatus( 200 );
                else
                    response.sendStatus( 400 );
            } catch ( err ) {
                logger.error( 'Failed sending updated state with error', err );
                response.sendStatus( 500 );
            }
        }
    );
};

export default {
    routes
};
