import request from '../request';

const RETRY_CAP = 10;

let room = location.pathname;
let connection: EventSource | null = null;
let hasConnected = false;
let retries = 0;

// TODO: Persist settings in local storage

const connect = (): Promise<void> => {
    return new Promise( ( resolve, reject ) => {
        room = location.pathname.substring( location.pathname.lastIndexOf( '/' ) + 1 );
        connection = new EventSource( request.backendURL + `/room/${ room }/connect` );

        connection.onopen = () => {
            hasConnected = true;
            console.log( '[SSE] Connection established successfully' );
            resolve();
        };

        connection.onmessage = msg => {
            console.log( msg.data );
            // TODO: On connect, retrieve data from poll endpoint
        };

        connection.onerror = () => {
            connection?.close();

            if ( !hasConnected ) return reject( 'ERR_CONNECT' );

            console.error( '[SSE] Connection failed, reconnecting' );

            if ( retries <= RETRY_CAP ) {
                retries += 1;
                setTimeout( () => {
                    connect();
                }, 1000 * retries );
            }
        };
    } );
};

export default {
    connect
};
