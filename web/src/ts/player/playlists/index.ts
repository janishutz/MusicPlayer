import {
    currentSource,
    queue,
    queueIdx,
    repeat,
    sources
} from '../state';
import {
    startTracking,
    stopTracking
} from '../status-tracking';

/**
 * Play a song at the given index of the queue. Wraps to 0 and end if index below 0 or above end
 * @param idx - The index in the queue to play at
 */
export const playIndex = async ( idx: number ) => {
    if ( idx >= queue.value.length ) {
        idx = repeat.value === 'all' ? 0 : -1;
    } else if ( idx < 0 ) {
        idx = repeat.value === 'all' ? queue.value.length - 1 : -1;
    }

    if ( idx < 0 ) return false;

    sources[currentSource.value]?.stop();
    stopTracking();

    const nextSong = queue.value[ idx ]!;

    queueIdx.value = idx;
    currentSource.value = nextSong.source;
    sources[currentSource.value]?.playSong( nextSong.identifier );

    startTracking();
};
