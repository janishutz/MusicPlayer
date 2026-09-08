import {
    type StateUpdate,
    messageHandler
} from './messageHandler';
import {
    currentQueue,
    currentQueueIdx,
    isPlaying,
    playbackOffset,
    playbackProgress,
    playbackTime,
    startTime
} from './state';
import type {
    Song
} from '../dtype/playlist';
import request from '../request';

const RETRY_CAP = 10;

let room = location.pathname;
let connection: EventSource | null = null;
let hasConnected = false;
let retries = 0;

// TODO: Persist settings in local storage
// TODO: Polling instead of sse

const connect = (): Promise<void> => {
    return new Promise( ( resolve, reject ) => {
        room = location.pathname.substring( location.pathname.lastIndexOf( '/' ) + 1 );
        connection = new EventSource( request.backendURL + `/room/${ room }/connect` );

        connection.onopen = async () => {
            hasConnected = true;
            console.log( '[SSE] Connection established successfully' );
            const data = await ( await request.get( `/room/${ room }/poll` ) ).json() as {
                'playlist': Song[],
                'state': StateUpdate
            };

            currentQueue.value = data.playlist;
            currentQueueIdx.value = data.state.index;
            isPlaying.value = data.state.playing;
            startTime.value = data.state.start;
            playbackTime.value = data.state.offset;
            playbackOffset.value = data.state.offset;
            playbackProgress.value = data.state.offset / ( data.playlist[ data.state.index ]?.duration ?? -1 );
            resolve();
        };

        connection.onmessage = msg => {
            if ( msg.data === 'close' ) {
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
                    connect();
                }, 1000 * retries );
            }
        };
    } );
};

export default {
    connect
};
