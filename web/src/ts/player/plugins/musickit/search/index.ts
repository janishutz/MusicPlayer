import type {
    MusicKitInstance
} from 'musickitjs-v3-types/MusicKitInstance';
import type {
    Song
} from '@/ts/dtype/playlist';
import {
    openImportTypePicker
} from '@/composables/importTypePicker';
import {
    searchSongs
} from './songs';

export const addFromAppleMusic = async ( instance: MusicKitInstance, cb: ( songs: Song[] ) => void ): Promise<void> => {
    const songs = await searchSongs( instance, cb );

    openImportTypePicker( [
        {
            'name': 'Songs',
            'type': 'cloud',
            'addSelected': songs.addSelected,
            'search': songs.search
        },
        {
            'name': 'Playlists',
            'type': 'cloud',
            'addSelected': songs.addSelected,
            'search': songs.search
        }
    ] );
};
