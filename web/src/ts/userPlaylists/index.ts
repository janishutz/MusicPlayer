import {
    editingPlaylists,
    playlistIdx,
    playlists
} from './state';
import player from '../player';


export const addPlaylist = ( name: string ) => {
    playlists.value.push( {
        'name': name,
        'songs': []
    } );
    editingPlaylists.value.push( false );
};

export const removePlaylist = ( idx: number ) => {
    if ( confirm( 'Do you really want to delete this playlist?' ) ) {
        playlists.value.splice( idx, 1 );
        editingPlaylists.value.splice( idx, 1 );
    }
};

export const selectPlaylist = ( idx: number ) => {
    playlistIdx.value = idx;
    player.clearQueue();
    player.loadPlaylist( playlists.value[ idx ]!.songs );
};

export const setPlaylistIdx = ( idx: number ) => {
    playlistIdx.value = idx;
};
