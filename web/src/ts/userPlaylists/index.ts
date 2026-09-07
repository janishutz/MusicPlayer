import {
    editingPlaylists,
    playlists
} from './state';

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
