import {
    currentSource,
    queueIdx,
    repeat,
    sources
} from './state';
import {
    playIndex
} from './playlists';
import {
    ref
} from 'vue';

// Tracking of time and player status
let interval = -1;

export const playbackPercentage = ref( 0 );

export const duration = ref( 0 );

export const startTracking = () => {
    if ( interval === -1 ) {
        interval = setInterval( tracker, 250 );
    }

    duration.value = sources[currentSource.value]?.getDuration() ?? -1;
    setTimeout( () => {
        duration.value = sources[currentSource.value]?.getDuration() ?? -1;
    }, 2000 );
};

const tracker = () => {
    playbackPercentage.value = sources[currentSource.value]?.getPlaybackPos() ?? -1;

    if ( playbackPercentage.value > 0.995 && duration.value > 0 ) {
        if ( repeat.value === 'one' ) {
            sources[currentSource.value]?.seekTo( 0 );
        } else {
            stopTracking();
            playIndex( queueIdx.value + 1 );
        }
    }
};

export const stopTracking = () => {
    try {
        clearInterval( interval );
    } catch {
        // empty
    }

    interval = -1;
};
