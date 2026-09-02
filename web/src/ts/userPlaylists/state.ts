import {
    type Ref,
    ref
} from 'vue';
import type {
    PlaylistSongs
} from '../dtype/playlist';

const currentPlaylist = ref( '' );
const playlists: Ref<PlaylistSongs> = ref( [] );
