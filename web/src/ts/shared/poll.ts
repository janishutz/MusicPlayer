import {
    currentQueue,
    currentQueueIdx,
    isPlaying,
    playbackOffset,
    playbackProgress,
    playbackTime,
    popupMsg,
    popupTitle,
    showInfoPopup,
    startTime
} from './state';
import type {
    Song
} from '../dtype/playlist';
import type {
    StateUpdate
} from './messageHandler';
import {
    request
} from '@janishutz/oidc-login-sdk-browser';
import {
    reset
} from './reset';

const POLL_INTERVAL = 60000;

let interval = -1;


const connect = () => {
    const room = location.pathname.substring( location.pathname.lastIndexOf( '/' ) + 1 );

    interval = setInterval( async () => {
        try {
            await poll( room );
        } catch ( error ) {
            if ( ( error as Error ).message === 'ERR_404' ) {
                popupTitle.value = 'Share deleted';
                popupMsg.value = 'The share you were connected to has been deleted';
                showInfoPopup.value = true;
            }
        }
    }, POLL_INTERVAL );
};

const disconnect = () => {
    try {
        clearInterval( interval );
    } catch { /* empty */ }

    reset();
};

const poll = async ( room: string ): Promise<{
    'antiTamper': boolean,
    'sse': boolean
}> => {
    const data = await ( await request.get( `/room/${ room }/poll` ) ).json() as {
        'playlist': Song[],
        'state': StateUpdate,
        'AT': boolean,
        'SSE': boolean
    };

    if ( data.playlist ) {
        currentQueue.value = data.playlist;
    }

    currentQueueIdx.value = data.state.index;
    isPlaying.value = data.state.playing;
    startTime.value = data.state.start;
    playbackOffset.value = data.state.offset;

    if ( data.playlist.length === 0 )
        playbackTime.value = 0;
    else {
        if ( isPlaying.value )
            playbackTime.value = ( ( new Date().getTime() - startTime.value ) / 1000 ) + playbackOffset.value;
        else
            playbackTime.value = data.state.offset;
    }

    playbackProgress.value = playbackTime.value / ( data.playlist[ data.state.index ]?.duration ?? -1 );

    return {
        'antiTamper': data.AT,
        'sse': data.SSE
    };
};

export default {
    connect,
    disconnect,
    poll
};
