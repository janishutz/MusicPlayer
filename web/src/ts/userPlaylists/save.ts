import {
    changesMade,
    queue,
    rawQueue,
    shuffle
} from '../player/state';
import {
    playlistIdx,
    playlists
} from './state';
import {
    addPlaylist
} from '.';
import {
    request
} from '@janishutz/oidc-login-sdk-browser';
import {
    useNotification
} from '@kyvg/vue3-notification';

export const savePlaylist = () => {
    if ( queue.value.length === 0 ) return;

    rawQueue.value = queue.value;
    shuffle.value = false;

    if ( playlistIdx.value < 0 ) {
        let name: null | string = '';

        while ( !name || name.length === 0 ) {
            name = prompt( 'You are trying to save a playlist that has not previously been created. Please enter a name for it' );

            if ( !name ) return;
        }

        addPlaylist( name );
        playlistIdx.value = playlists.value.length - 1;
    }

    console.log( 'Saving to playlsit with idx', playlistIdx.value );

    playlists.value[ playlistIdx.value ]!.songs = queue.value;

    savePlaylists();
};

let playlistOperationLock = false;

// Rate limited
export const getPlaylists = async () => {
    if ( playlistOperationLock ) return;

    playlistOperationLock = true;

    try {
        playlists.value = ( await ( await request.get( '/user/playlists' ) ).json() ).playlists;
    } catch ( e ) {
        console.error( e );
    }

    setTimeout( () => {
        playlistOperationLock = false;
    }, 1000 );
};

// Rate limited
export const savePlaylists = async () => {
    if ( playlistOperationLock ) return;

    playlistOperationLock = true;
    const notifications = useNotification();

    try {
        await request.post( '/user/playlists', JSON.stringify( {
            'playlists': playlists.value,
            'version': '1'
        } ) );
        changesMade.value = false;
        notifications.notify( {
            'text': 'Playlists saved successfully',
            'type': 'success',
            'title': 'Playlists'
        } );
    } catch ( e ) {
        console.error( e );
        notifications.notify( {
            'text': 'Failed to save playlists',
            'type': 'error',
            'title': 'Playlists'
        } );
    }

    setTimeout( () => {
        playlistOperationLock = false;
    }, 1000 );
};
