// TODO: Persist settings in local storage
import {
    enableAntiTamper,
    popupMsg,
    popupTitle,
    showInfoPopup
} from './state';
import poll from './poll';
import sse from './sse';
import ws from './ws';

const connect = async () => {
    // Load first data
    const room = location.pathname.substring( location.pathname.lastIndexOf( '/' ) + 1 );

    try {
        const conf = await poll.poll( room );

        if ( enableAntiTamper.value && conf.antiTamper ) {
            console.warn( 'Anti Tamper Enabled!' );
            ws.connect( room );
        } else {
            // TODO: SSE?
            // SSE would only update the state, if the playlist changes, a special event is dispatched and new data is fetched
            if ( conf.sse ) {
                sse.connect( room );
            } else {
                poll.connect();
            }
        }
    } catch ( e ) {
        const error = await e as Error;

        if ( error.message === 'ERR_404' ) {
            popupTitle.value = 'Share not found';
            popupMsg.value = 'The share you have specified does not currently exist. Please try again later';
            showInfoPopup.value = true;
        }
    }
};

export default {
    connect
};
