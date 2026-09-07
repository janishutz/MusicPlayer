import {
    type Ref,
    ref
} from 'vue';
import type {
    Playlist
} from './file';

export const playlistIdx = ref( -1 );

export const playlists: Ref<Playlist[]> = ref( [] );

export const editingPlaylists: Ref<boolean[]> = ref( [] );
