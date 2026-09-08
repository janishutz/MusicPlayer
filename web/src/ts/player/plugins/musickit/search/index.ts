import {
    type CloudImport,
    openImportTypePicker
} from '@/composables/importTypePicker';
import type {
    Song
} from '@/ts/dtype/playlist';
import {
    openSearchInterface
} from '@/composables/searchManager';
import {
    searchPlaylists
} from './playlists';
import {
    searchSongs
} from './songs';

export const addFromAppleMusic = async ( cb: ( songs: Song[] ) => void, kindIdx?: number, autoClose?: boolean ): Promise<void> => {
    const songs = await searchSongs( cb );
    const playlists = await searchPlaylists( cb );
    const kinds: CloudImport[] = [
        {
            'name': 'Songs',
            'type': 'cloud',
            'addSelected': songs.addSelected,
            'search': songs.search,
            'minChars': 3,
            'autoClose': autoClose ?? false
        },
        {
            'name': 'Playlists',
            'type': 'cloud',
            'addSelected': playlists.addSelected,
            'search': playlists.search,
            'autoClose': autoClose ?? false
        }
    ];

    if ( kindIdx === undefined )
        openImportTypePicker( kinds );
    else
        openSearchInterface( kinds[kindIdx]! );
};
