import {
    currentQueue,
    currentQueueIdx,
    isPlaying,
    startTime
} from './state';
import type {
    Song
} from '../dtype/playlist';

interface ReceivedJSONMessage {
    'type': 'state' | 'playlist';
    'data': unknown;
}

export interface StateUpdate {
    'playing': boolean;
    'index': number;
    'start': number;
}

export const messageHandler = ( msg: string ) => {
    if ( msg.startsWith( 'json:' ) ) {
        try {
            const data = JSON.parse( msg.substring( 5 ) ) as ReceivedJSONMessage;

            if ( data.type === 'playlist' ) {
                currentQueue.value = ( data.data as {
                    'playlist': Song[]
                } ?? {
                    'playlist': []
                } ).playlist;
            } else if ( data.type === 'state' ) {
                const state = data.data as StateUpdate;

                currentQueueIdx.value = state.index;
                isPlaying.value = state.playing;
                startTime.value = state.start;
            } else {
                console.log( '[SSE] Received unknown data', data.type );
            }
        } catch ( err ) {
            console.error( 'JSON DECODE failed with error', err );
        }
    }
};
