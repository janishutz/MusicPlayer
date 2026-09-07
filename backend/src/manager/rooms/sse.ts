import {
    Config
} from '../../dtype/config';
import express from 'express';
import {
    generateToken
} from '../../token';
import rooms from '.';

export const sseMiddleware = ( kind: 'client' | 'trackingClient', config?: Config ) => {
    return ( request: express.Request, response: express.Response ) => {
        if ( typeof request.params.id !== 'string' )
            return response.sendStatus( 400 );

        const room = rooms.get( request.params.id );

        if ( !room ) return response.sendStatus( 404 );

        response.writeHead( 200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        } );
        response.status( 200 );
        response.flushHeaders();

        if ( kind === 'trackingClient' || config?.clientMode === 'poll' )
            response.write( 'data: use-poll\n\n' );
        else
            response.write( 'data: connected\n\n' );

        const token = generateToken( 20 );

        rooms.addClient( request.params.id, token, kind, response );

        request.on( 'close', () => {
            rooms.removeClient( request.params.id as string, token, kind );
        } );
    };
};
