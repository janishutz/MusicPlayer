import {
    allowAntiTamper,
    isAntiTamperAvailable,
    isAntiTamperPossiblePage,
    popupMsg,
    popupTitle,
    showInfoPopup,
    showShareNotFoundPopup
} from './state';
import antiTamper from './anti-tamper';
import poll from './poll';
import sse from './sse';
import {
    watch
} from 'vue';
import ws from './ws';

const connect = async () => {
    // Load first data
    const room = location.pathname.substring( location.pathname.lastIndexOf( '/' ) + 1 );

    try {
        const conf = await poll.poll( room );

        isAntiTamperAvailable.value = conf.antiTamper;

        if ( allowAntiTamper.value && conf.antiTamper ) {
            console.warn( 'Anti Tamper Enabled!' );
            startAntiTamper( room );
        } else {
            startNormalOperation( room, conf.sse );
        }

        if ( isAntiTamperAvailable.value && isAntiTamperPossiblePage ) {
            console.log( 'Anti-Tamper possible' );
            let lock = false;

            watch( allowAntiTamper, () => {
                if ( lock ) return;

                lock = true;
                setTimeout( () => {
                    lock = false;
                }, 2500 );

                if ( allowAntiTamper.value ) {
                    startAntiTamper( room );
                } else {
                    startNormalOperation( room, conf.sse );
                }
            } );
        }
    } catch ( e ) {
        const error = await e as Error;

        if ( error.message === 'ERR_404' ) {
            showShareNotFoundPopup.value = true;
        } else {
            console.error( e );
        }
    }
};

const startAntiTamper = ( room: string ) => {
    antiTamper.start();
    ws.connect( room );
    sse.disconnect();
    poll.disconnect();

    showInfoPopup.value = true;
    popupMsg.value = `Please allow notifications for this page, to make people trying to tamper aware that they are not allowed to do that.
You may also consider adding a name for this client using the settings icon in the top left corner.
If you do not wish to use Anti-Tamper, turn it off in settings.`;
    popupTitle.value = 'Anti-Tamper Enabled';
};

const startNormalOperation = ( room: string, enableSSE: boolean ) => {
    antiTamper.stop();
    ws.disconnect();
    sse.disconnect();
    poll.disconnect();

    if ( enableSSE ) {
        sse.connect( room );
    } else {
        poll.connect();
    }
};

export default {
    connect
};
