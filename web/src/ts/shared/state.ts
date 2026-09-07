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
