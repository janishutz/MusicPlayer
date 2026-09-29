// TODO: Persist settings in local storage
import {
    allowAntiTamper,
    popupMsg,
    popupTitle,
    showInfoPopup
} from './state';
import antiTamper from './anti-tamper';
import poll from './poll';
import sse from './sse';
import ws from './ws';

const connect = async () => {
    // Load first data
    const room = location.pathname.substring( location.pathname.lastIndexOf( '/' ) + 1 );

    try {
        const conf = await poll.poll( room );

        if ( allowAntiTamper.value && conf.antiTamper ) {
            console.warn( 'Anti Tamper Enabled!' );
            antiTamper.start();
            ws.connect( room );
            showInfoPopup.value = true;
            popupMsg.value = `Please allow notifications for this page, to make people trying to tamper aware that they are not allowed to do that.
You may also consider adding a name for this client using the settings icon in the top left corner.
If you do not wish to use Anti-Tamper, replace "fancy" in the URL with "share".`;
            popupTitle.value = 'Anti-Tamper Enabled';
        } else {
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
