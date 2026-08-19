import {
    type Ref,
    ref
} from 'vue';
import type {
    Playlist
} from '../dtype/playlist';

export const queueIdx = ref( 0 );

export const queue: Ref<Playlist> = ref( [] );

export const isPlaying = ref( false );

export const shuffle = ref( false );

export const repeat: Ref<'off' | 'one' | 'all'> = ref( 'off' );

export const playbackPercentage = ref( 0 );

export const duration = ref( 0 );
