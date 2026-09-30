import {
    playlistIdx,
    playlists
} from './state';
import {
    changesMade
} from '../player/state';
import player from '../player';


export const addPlaylist = ( name: string ) => {
    playlists.value.push( {
        'name': name,
        'songs': [],
        'icon': 'music'
    } );
    changesMade.value = true;
};

export const removePlaylist = ( idx: number ) => {
    playlists.value.splice( idx, 1 );
    changesMade.value = true;
};

export const selectPlaylist = ( idx: number ) => {
    player.clearQueue();
    playlistIdx.value = idx;
    player.loadPlaylist( playlists.value[ idx ]!.songs );
};

export const setPlaylistIdx = ( idx: number ) => {
    playlistIdx.value = idx;
};
