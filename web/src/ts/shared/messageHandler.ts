import {
    currentQueue,
    currentQueueIdx,
    isPlaying,
    playbackOffset,
    playbackTime,
    startTime
} from './state';
import type {
    Song
} from '../dtype/playlist';

export interface StateUpdate {
    'playing': boolean;
    'index': number;
    'start': number;
    'offset': number;
}

export const messageHandler = ( msg: string ) => {
    try {
        const data = JSON.parse( msg );

        if ( data.type === 'playlist' ) {
            currentQueue.value = ( data as {
                'playlist': Song[]
            } ?? {
                'playlist': []
            } ).playlist;
        } else if ( data.type === 'state' ) {
            const state = data as StateUpdate;

            currentQueueIdx.value = state.index;
            isPlaying.value = state.playing;
            startTime.value = state.start;
            playbackTime.value = state.offset;
            playbackOffset.value = state.offset;
        } else {
            console.log( '[CONN] Received unknown data', data.type );
        }
    } catch ( err ) {
        console.error( 'JSON DECODE failed with error', err );
    }
};
