import {
    playlistIdx,
    playlists
} from './state';
import player from '../player';


export const addPlaylist = ( name: string ) => {
    playlists.value.push( {
        'name': name,
        'songs': [],
        'icon': 'music'
    } );
};

export const removePlaylist = ( idx: number ) => {
    playlists.value.splice( idx, 1 );
};

export const selectPlaylist = ( idx: number ) => {
    player.clearQueue();
    playlistIdx.value = idx;
    player.loadPlaylist( playlists.value[ idx ]!.songs );
};

export const setPlaylistIdx = ( idx: number ) => {
    console.log( 'Setting playlist index' );
    playlistIdx.value = idx;
};
