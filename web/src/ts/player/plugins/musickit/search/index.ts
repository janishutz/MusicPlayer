import type {
    Song
} from '@/ts/dtype/playlist';
import {
    openImportTypePicker
} from '@/composables/importTypePicker';
import {
    searchPlaylists
} from './playlists';
import {
    searchSongs
} from './songs';

export const addFromAppleMusic = async ( cb: ( songs: Song[] ) => void ): Promise<void> => {
    const songs = await searchSongs( cb );
    const playlists = await searchPlaylists( cb );

    openImportTypePicker( [
        {
            'name': 'Songs',
            'type': 'cloud',
            'addSelected': songs.addSelected,
            'search': songs.search,
            'minChars': 3
        },
        {
            'name': 'Playlists',
            'type': 'cloud',
            'addSelected': playlists.addSelected,
            'search': playlists.search
        }
    ] );
};
