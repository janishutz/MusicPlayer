import {
    type Ref,
    ref
} from 'vue';
import type {
    Song
} from '../dtype/playlist';

export const currentQueue: Ref<Song[]> = ref( [] );

export const isPlaying = ref( false );

export const currentQueueIdx = ref( -1 );

export const startTime = ref( new Date().getTime() );

export const showArtworks = ref( false );

export const playbackTime = ref( 0 );

export const playbackOffset = ref( 0 );

export const playbackProgress = ref( 0 );
