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
import {
    playbackPercentage
} from '../player/status-tracking';
import {
    reauth
} from '../util/reauth';
import {
    request
} from '@janishutz/oidc-login-sdk-browser';

const RETRY_CAP = 10;

export const room = ref( localStorage.getItem( 'room' ) ?? '' );

export const isConnected = ref( false );

export const useAntiTamper = ref( false );

// TODO: Anit-Tamper
// const antiTamperClients = [];

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
        }
    }

    localStorage.setItem( 'room', name );
    useAntiTamper.value = antiTamper;
    room.value = name;

    document.addEventListener( 'autherror', reauth );

    try {
        return await connect();
    } catch ( e ) {
        console.debug( '[WS] Setup failed with error', e );

        return false;
    }
};

const closeRoom = async () => {
    isConnected.value = false;
    localStorage.removeItem( 'room' );
    connection?.send( 'close' );
    connection?.close();

    try {
        document.removeEventListener( 'autherror', reauth );
    } catch { /* empty */ }
};

const connect = (): Promise<boolean> => {
    return new Promise( ( resolve, reject ) => {
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
            console.log( msg );
        };

        connection.onerror = () => {
            connection?.close();
            console.error( '[WS] Reconnecting due to error' );

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

// FIXME: This is not a sensible solution, but easy for now (i.e. solve properly)
let playlistLock = false;
let stateLock = false;

const sendPlaylistData = () => {
    if ( isConnected.value && !playlistLock ) {
        playlistLock = true;

        connection!.send( JSON.stringify( {
            'kind': 'playlist',
            'playlist': queue.value
        } ) );

        setTimeout( () => {
            playlistLock = false;
        }, 500 );
    }
};

const sendStateData = async () => {
    if ( isConnected.value && !stateLock ) {
        stateLock = true;

        connection!.send( JSON.stringify( {
            'kind': 'state',
            'playing': isPlaying.value,
            'index': queueIdx.value,
            'start': new Date().getTime() - 100,
            'offset': playbackPercentage.value * ( queue.value[ queueIdx.value ]?.duration ?? 0 )
        } ) );

        setTimeout( () => {
            stateLock = false;
        }, 500 );
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
