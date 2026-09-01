import {
    addSongList,
    clearQueue,
    shuffleList
} from './playlists/add';
import {
    currentSource,
    isPlaying,
    queue,
    queueIdx,
    rawQueue,
    repeat,
    shuffle,
    sources
} from './state';
import {
    duration,
    playbackPercentage,
    startTracking,
    stopTracking
} from './status-tracking';
import type {
    RepeatMode
} from '../dtype/player';
import {
    playIndex
} from './playlists';

const next = () => {
    playIndex( queueIdx.value + 1 );
};

const prev = () => {
    // TODO: Back to beginning if more than some seconds have passed?
    playIndex( queueIdx.value - 1 );
};

const play = () => {
    if ( currentSource.value === '' ) return;

    isPlaying.value = true;

    sources[currentSource.value]?.play();
    startTracking();
};

const pause = () => {
    if ( currentSource.value === '' ) return;

    isPlaying.value = false;

    sources[currentSource.value]?.pause();
    stopTracking();
};

/**
 * Seek to a specific point in the song
 * @param pos - Percentage of song, value in [0, 1]
 */
const seekTo = ( pos: number ) => {
    if ( currentSource.value === '' ) return;

    sources[currentSource.value]?.seekTo( pos );
};

const skip10 = () => {
    if ( currentSource.value === '' ) return;

    const source = sources[currentSource.value];
    const duration = source?.getDuration() ?? -1;

    seekTo( ( ( ( source?.getPlaybackPos() ?? 0 ) * duration ) + 10 ) / duration );
};

const back10 = () => {
    if ( currentSource.value === '' ) return;

    const source = sources[currentSource.value];
    const duration = source?.getDuration() ?? -1;

    seekTo( ( ( ( source?.getPlaybackPos() ?? 0 ) * duration ) - 10 ) / duration );
};

/**
 * Turn on or off shuffle
 * @param enabled - Whether to enable or disable shuffle
 */
const setShuffle = ( enabled: boolean ) => {
    shuffle.value = enabled;

    if ( enabled ) {
        shuffleList();
        queueIdx.value = 0;
    } else {
        const curr = queue.value[queueIdx.value];

        queue.value = [];

        for ( let i = 0; i < rawQueue.value.length; i++ ) {
            if ( rawQueue.value[i] === curr )
                queueIdx.value = i;

            queue.value.push( rawQueue.value[i]! );
        }
    }
};

/**
 * Change the repeat mode
 * @param mode - The repeat mode to switch into
 */
const setRepeat = ( mode: RepeatMode ) => {
    repeat.value = mode;
};

const getSources = (): string[] => {
    return Object.keys( sources );
};

const addSongFromSource = async ( source: string ) => {
    sources[source]!.addSongsFromThisSource( addSongList );
};

export default {
    play,
    pause,
    seekTo,
    skip10,
    back10,
    setShuffle,
    setRepeat,
    playIndex,
    getSources,
    addSongFromSource,
    next,
    prev,
    clearQueue,
    queue,
    queueIdx,
    duration,
    playbackPercentage,
    repeat,
    shuffle,
    isPlaying
};
