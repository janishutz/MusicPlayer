import {
    type Ref,
    ref
} from 'vue';
import type {
    PlayerSourcePlugin
} from './plugins/interface';
import type {
    Playlist
} from '../dtype/playlist';
import type {
    RepeatMode
} from '../dtype/player';

export const sources: {
    [key: string]: PlayerSourcePlugin
} = {};

export const currentSource = ref( '' );

export const queueIdx = ref( 0 );

export const queue: Ref<Playlist> = ref( [] );

export const isPlaying = ref( false );

export const shuffle = ref( false );

export const repeat: Ref<RepeatMode> = ref( 'off' );

export const playbackPercentage = ref( 0 );

export const duration = ref( 0 );
