import {
    editingPlaylists,
    playlistIdx,
    playlists
} from './state';
import {
    queue,
    rawQueue,
    shuffle
} from '../player/state';
import {
    addPlaylist
} from '.';
import request from '../request';
import {
    useNotification
} from '@kyvg/vue3-notification';

export const savePlaylist = async () => {
    rawQueue.value = queue.value;
    shuffle.value = false;

    if ( playlistIdx.value ) {
        let name: null | string = '';

        while ( !name || name.length === 0 ) {
            name = prompt( 'You are trying to save a playlist that has not previously been created. Please enter a name for it' );
        }

        addPlaylist( name );
        playlistIdx.value = playlists.value.length - 1;
    }

    playlists.value[ playlistIdx.value ]!.songs = rawQueue.value;

    savePlaylists();
};

export const getPlaylists = async () => {
    playlists.value = await ( await request.get( '/user/playlists' ) ).json();
    editingPlaylists.value = playlists.value.map( () => false );
};

export const savePlaylists = async () => {
    const notifications = useNotification();

    try {
        await request.post( '/user/playlists', JSON.stringify( playlists.value ) );
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
};
