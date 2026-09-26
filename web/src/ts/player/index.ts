import {
    addSongList,
    clearQueue,
    removeSong,
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
    playbackPercentage
} from './status-tracking';
import {
    next,
    pause,
    play,
    prev,
    seekTo
} from './controls';
import type {
    RepeatMode
} from '../dtype/player';
import type {
    Song
} from '../dtype/playlist';
import {
    load
} from './playlists/loader';
import {
    playIndex
} from './playlists';
import {
    useKeyboardListener
} from './binds';

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
    if ( rawQueue.value.length === 0 ) return;

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
    if ( rawQueue.value.length === 0 ) return;

    repeat.value = mode;
};

const getSources = (): string[] => {
    return Object.keys( sources );
};

const addToSongList = ( songs: Song[] ) => {
    addSongList( songs );

    if ( currentSource.value === '' ) {
        playIndex( 0 );
    }
};

/**
 * Add songs to the playlist from given source
 * @param source - The ID of the source to add from
 * @param cb - A custom callback to be executed instead of the default, which adds to queue
 * @param skipLogin - Whether to skip login checks
 */
const addSongFromSource = async ( source: string, cb?: ( songs: Song[] ) => void, skipLogin?: boolean ): Promise<boolean> => {
    if ( sources[source]!.authorized.value || skipLogin ) {
        sources[source]!.addSongsFromThisSource( cb ? cb : addToSongList, skipLogin ? 0 : undefined, skipLogin );
    } else {
        sources[source]!.login!();

        return false;
    }

    return true;
};

useKeyboardListener();

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
    removeSong,
    queue,
    queueIdx,
    duration,
    playbackPercentage,
    repeat,
    shuffle,
    isPlaying,
    'loadPlaylist': load
};
