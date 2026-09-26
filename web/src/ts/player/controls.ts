import {
    currentSource,
    isPlaying,
    queue,
    queueIdx,
    sources
} from './state';
import {
    duration,
    playbackPercentage,
    startTracking,
    stopTracking
} from './status-tracking';
import {
    playIndex
} from './playlists';

export const next = () => {
    playIndex( ( queueIdx.value + 1 ) % queue.value.length );
};

export const prev = () => {
    if ( playbackPercentage.value * duration.value > 7 )
        return seekTo( 0 );

    playIndex( ( queueIdx.value - 1 + queue.value.length ) % queue.value.length );
};

export const play = () => {
    if ( currentSource.value === '' ) return;

    isPlaying.value = true;

    sources[currentSource.value]?.play();
    startTracking();
    document.dispatchEvent( new CustomEvent( 'musicplayer:playpause' ) );
};

export const pause = () => {
    if ( currentSource.value === '' ) return;

    isPlaying.value = false;

    sources[currentSource.value]?.pause();
    stopTracking();
    document.dispatchEvent( new CustomEvent( 'musicplayer:playpause' ) );
};

/**
 * Seek to a specific point in the song
 * @param pos - Percentage of song, value in [0, 1]
 */
export const seekTo = ( pos: number ) => {
    if ( currentSource.value === '' ) return;

    sources[currentSource.value]?.seekTo( pos );
    playbackPercentage.value = pos;
    document.dispatchEvent( new CustomEvent( 'musicplayer:seek' ) );
};
