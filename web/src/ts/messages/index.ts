import {
    duration,
    playbackPercentage
} from '../player/status-tracking';
import {
    isPlaying,
    queue,
    queueIdx
} from '../player/state';
import {
    ref,
    watch
} from 'vue';
import request from '../request';

const RETRY_CAP = 10;

export const room = ref( localStorage.getItem( 'room' ) ?? '' );

export const isConnected = ref( false );

export const useAntiTamper = ref( false );

// const antiTamperClients = [];

let connection: null | EventSource = null;
let retries = 0;

// TODO: Persist room name in local storage

const createRoom = async ( name: string, antiTamper: boolean ): Promise<boolean> => {
    if ( !( /^[a-zA-Z0-9-]{3,20}$/ ).test( name ) ) return false;

    try {
        await request.get( '/room/create?room=' + name );
    } catch ( err ) {
        if ( err === 'ERR_409' ) {
            return await connect();
        }
    }

    localStorage.setItem( 'room', name );
    useAntiTamper.value = antiTamper;
    room.value = name;

    return await connect();
};

const closeRoom = async () => {
    // TODO: Trigger close on backend and disconnect.
    isConnected.value = false;
    localStorage.removeItem( 'room' );
};

const connect = (): Promise<boolean> => {
    return new Promise( ( resolve, reject ) => {
        if ( !useAntiTamper.value ) {
            isConnected.value = true;

            return resolve( true );
        }

        connection = new EventSource( request.backendURL + `/room/${ room.value }/admin`, {
            'withCredentials': true
        } );

        connection.onopen = () => {
            isConnected.value = true;
            console.log( '[SSE] Connection established successfully' );
            resolve( true );
        };

        connection.onmessage = msg => {
            console.log( msg );
        };

        connection.onerror = () => {
            connection?.close();
            console.error( '[SSE] Reconnecting due to error' );

            if ( !isConnected.value ) reject( 'ERR_CONNECT' );

            if ( retries <= RETRY_CAP ) {
                retries += 1;

                setTimeout( () => {
                    createRoom( room.value, useAntiTamper.value );
                }, 1000 * retries );
            }
        };
    } );
};

const useRoomWatchers = () => {
    watch( queue, () => {
        if ( isConnected.value )
            request.post( `/room/${ room.value }/update/playlist`, JSON.stringify( {
                'playlist': queue.value
            } ) );
    } );

    watch( [
        isPlaying,
        queueIdx
    ], () => {
        if ( isConnected.value )
            request.post( `/room/${ room.value }/update/state`, JSON.stringify( {
                'playing': isPlaying.value,
                'index': queueIdx.value,
                'start': new Date().getTime() - ( playbackPercentage.value * duration.value ) - 100
            } ) );
    } );

    if ( room.value ) connect();
};

export default {
    createRoom,
    useRoomWatchers,
    closeRoom
};
