import {
    currentSource,
    queueIdx,
    repeat,
    shuffle,
    sources
} from './state';
import {
    startTracking,
    stopTracking
} from './status-tracking';
import type {
    RepeatMode
} from '../dtype/player';
import {
    addSongList
} from './playlists/add';
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

    sources[currentSource.value]?.play();
    startTracking();
};

const pause = () => {
    if ( currentSource.value === '' ) return;

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

const setShuffle = ( enabled: boolean ) => {
    // TODO: Shuffle the order
    shuffle.value = enabled;
};

const setRepeat = ( mode: RepeatMode ) => {
    repeat.value = mode;
};

const getSources = (): string[] => {
    return Object.keys( sources );
};

const addSongFromSource = async ( source: string ) => {
    addSongList( await sources[source]!.addSongsFromThisSource() );
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
    prev
};
