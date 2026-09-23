import {
    request
} from '@janishutz/oidc-login-sdk-browser';
import {
    reset
} from './reset';

const RETRY_CAP = 10;

let room = location.pathname;
let connection: WebSocket | null = null;
let hasConnected = false;
let retries = 0;

const connect = ( roomId: string ) => {
    room = roomId;
    connectHandler();
};

const disconnect = () => {
    connection?.send( 'disconnect' );
    connection?.close();
    connection = null;
    hasConnected = false;
    retries = 0;
    reset();
};

const connectHandler = (): Promise<boolean> => {
    return new Promise( ( resolve, reject ) => {
        room = location.pathname.substring( location.pathname.lastIndexOf( '/' ) + 1 );
        const url = request.getBackendURL();

        if ( url.protocol === 'https:' )
            url.protocol = 'wss:';
        else
            url.protocol = 'ws:';

        url.pathname = `room/${ room }/ws`;

        connection = new WebSocket( url );

        connection.onopen = () => {
            hasConnected = true;
            console.log( '[WS] Connection established successfully' );
            resolve( true );
        };

        connection.onmessage = msg => {
            console.log( msg );
        };

        connection.onerror = () => {
            connection?.close();
            console.error( '[WS] Reconnecting due to error' );

            if ( !hasConnected ) reject( 'ERR_CONNECT' );

            if ( retries <= RETRY_CAP ) {
                retries += 1;

                setTimeout( () => {
                    connectHandler();
                }, 1000 * retries );
            }
        };
    } );
};

export default {
    connect,
    disconnect
};
