// TODO: Persist settings in local storage
import {
    enableAntiTamper,
    errMsg
} from './state';
import poll from './poll';
import ws from './ws';

const connect = async () => {
    // Load first data
    const room = location.pathname.substring( location.pathname.lastIndexOf( '/' ) + 1 );

    try {
        const antiTamper = await poll.poll( room );

        if ( enableAntiTamper.value && antiTamper ) {
            ws.connect( room );
        } else {
            // TODO: SSE?
            // SSE would only update the state, if the playlist changes, a special event is dispatched and new data is fetched
            poll.connect();
        }
    } catch ( e ) {
        const error = await e;

        if ( error === 'ERR_404' ) {
            errMsg.value = 'Missing';
        }
    }
};

export default {
    connect
};
