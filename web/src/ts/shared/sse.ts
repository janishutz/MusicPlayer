import {
    messageHandler
} from './messageHandler';
import {
    request
} from '@janishutz/oidc-login-sdk-browser';
import {
    reset
} from './reset';

const RETRY_CAP = 10;

let room = location.pathname;
let connection: EventSource | null = null;
let hasConnected = false;
let retries = 0;

const connect = ( roomId: string ) => {
    room = roomId;
    connectHandler();
};

const disconnect = () => {
    connection?.close();
    connection = null;
    hasConnected = false;
    retries = 0;
    reset();
};

const connectHandler = (): Promise<void> => {
    return new Promise( ( resolve, reject ) => {
        connection = new EventSource( request.getBackendURL() + `/room/${ room }/connect` );

        connection.onopen = async () => {
            hasConnected = true;

            console.log( '[SSE] Connection established successfully' );
            resolve();
        };

        connection.onmessage = msg => {
            if ( msg.data === 'close-room' ) {
                connection?.close();

                // TODO: Show popup informing user that share was closed
                return;
            }

            messageHandler( msg.data );
        };

        connection.onerror = () => {
            connection?.close();

            if ( !hasConnected ) return reject( 'ERR_CONNECT' );

            console.error( '[SSE] Connection failed, reconnecting' );

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
