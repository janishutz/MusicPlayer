import {
    type Ref,
    ref
} from 'vue';
import type {
    PlayerSourcePlugin
} from './plugins/interface';
import type {
    PlaylistSongs
} from '../dtype/playlist';
import type {
    RepeatMode
} from '../dtype/player';
import {
    useLocalPlayer
} from './plugins/local';
import {
    useMusicKit
} from './plugins/musickit';

export const sources: {
    [key: string]: PlayerSourcePlugin
} = {};

export const currentSource = ref( '' );

export const rawQueue: Ref<PlaylistSongs> = ref( [] );

export const queueIdx = ref( -1 );

export const queue: Ref<PlaylistSongs> = ref( [] );

export const isPlaying = ref( false );

export const shuffle = ref( false );

export const repeat: Ref<RepeatMode> = ref( 'off' );

export const fullPlayer = ref( false );

const initSources = async () => {
    try {
        sources['applemusic'] = await useMusicKit();
    } catch {
        console.warn( 'MusicKitJS intialization failed' );
    }

    try {
        sources['local'] = await useLocalPlayer();
    } catch {
        console.warn( 'Local Player intialization failed' );
    }
};

initSources();
