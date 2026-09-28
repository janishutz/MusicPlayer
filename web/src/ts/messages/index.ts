import {
    isPlaying,
    queue,
    queueIdx
} from '../player/state';
import {
    onMounted,
    onUnmounted,
    ref,
    watch
} from 'vue';
import antiTamper from './anti-tamper';
import {
    playbackPercentage
} from '../player/status-tracking';
import {
    reauth
} from '../util/reauth';
import {
    request
} from '@janishutz/oidc-login-sdk-browser';

const RETRY_CAP = 20;

export const room = ref( localStorage.getItem( 'room' ) ?? '' );

export const isConnected = ref( false );

export const useAntiTamper = ref( false );

export const showShareFailedPopup = ref( false );

let connection: null | WebSocket = null;
let retries = 0;

const createRoom = async ( name: string, antiTamper: boolean ): Promise<boolean> => {
    if ( !( /^[a-zA-Z0-9-]{3,20}$/ ).test( name ) ) return false;

    try {
        await request.post( '/room/create', JSON.stringify( {
            'roomId': name,
            'antiTamper': antiTamper
        } ) );
    } catch ( err ) {
        if ( err === 'ERR_409' ) {
            return await connect();
        } else if ( err instanceof request.AuthError ) {
            isConnected.value = false;
            console.debug( '[REAUTH] Neeed to re-authenticate user due to unauthentication error' );
            reauth();

            return false;
        }
    }

    localStorage.setItem( 'room', name );
    useAntiTamper.value = antiTamper;
    room.value = name;

    document.addEventListener( 'musicplayer:reauth', reconnectRoom );

    try {
        return await connect();
    } catch ( e ) {
        console.debug( '[WS] Setup failed with error', e );

        return false;
    }
};

const reconnectRoom = () => {
    console.log( 'RE-CREATING' );
    createRoom( room.value, useAntiTamper.value );
};

const closeRoom = async () => {
    isConnected.value = false;
    localStorage.removeItem( 'room' );
    connection?.send( 'close-room' );
    connection?.close();

    try {
        document.removeEventListener( 'musicplayer:reauth', reconnectRoom );
    } catch { /* empty */ }
};

let reconnectLock = false;

const connect = (): Promise<boolean> => {
    return new Promise( ( resolve, reject ) => {
        stateLock = false;
        playlistLock = false;
        const url = request.getBackendURL();

        if ( url.protocol === 'https:' )
            url.protocol = 'wss:';
        else
            url.protocol = 'ws:';

        url.pathname = `room/${ room.value }/ws/admin`;

        connection = new WebSocket( url );

        connection.onopen = () => {
            isConnected.value = true;
            console.log( '[WS] Connection established successfully' );
            sendPlaylistData();
            sendStateData();
            resolve( true );
        };

        connection.onmessage = msg => {
            antiTamper.handler( msg );
        };

        const errorHandler = () => {
            if ( reconnectLock ) return;

            reconnectLock = true;
            connection?.close();
            console.error( '[WS] Reconnecting due to error' );

            if ( !isConnected.value ) reject( 'ERR_CONNECT' );

            if ( retries <= RETRY_CAP ) {
                retries += 1;

                setTimeout( () => {
                    createRoom( room.value, useAntiTamper.value );
                }, 1000 * retries );
            } else {
                showShareFailedPopup.value = true;
                isConnected.value = false;
            }
        };

        connection.onerror = errorHandler;
        connection.onclose = errorHandler;
        reconnectLock = false;
    } );
};

let playlistLock = false;
let stateLock = false;

const sendPlaylistData = () => {
    console.log( 'Trying to send playlist data' );

    if ( isConnected.value && !playlistLock ) {
        setTimeout( () => {
            playlistLock = false;
        }, 1000 );
        console.log( 'Sending playlist data' );
        playlistLock = true;

        connection!.send( JSON.stringify( {
            'type': 'playlist',
            'playlist': queue.value
        } ) );
    }
};

const sendStateData = async () => {
    console.log( 'Trying to send state data' );

    if ( isConnected.value && !stateLock ) {
        console.log( 'Sending state data' );
        setTimeout( () => {
            stateLock = false;
        }, 500 );
        stateLock = true;

        connection!.send( JSON.stringify( {
            'type': 'state',
            'playing': isPlaying.value,
            'index': queueIdx.value,
            'start': new Date().getTime() - 100,
            'offset': playbackPercentage.value * ( queue.value[ queueIdx.value ]?.duration ?? 0 )
        } ) );
    }
};

const useRoomWatchers = () => {
    watch( queue, sendPlaylistData );

    onMounted( () => {
        document.addEventListener( 'musicplayer:playindex', sendStateData );
        document.addEventListener( 'musicplayer:seek', sendStateData );
        document.addEventListener( 'musicplayer:playpause', sendStateData );
        document.addEventListener( 'musicplayer:update', sendPlaylistData );
    } );

    onUnmounted( () => {
        try {
            document.addEventListener( 'musicplayer:play', sendStateData );
        } catch { /* empty */ }

        try {
            document.addEventListener( 'musicplayer:seek', sendStateData );
        } catch { /* empty */ }

        try {
            document.addEventListener( 'musicplayer:playpause', sendStateData );
        } catch { /* empty */ }

        try {
            document.addEventListener( 'musicplayer:update', sendPlaylistData );
        } catch { /* empty */ }
    } );

    if ( room.value ) connect();
};

export default {
    createRoom,
    useRoomWatchers,
    closeRoom
};
