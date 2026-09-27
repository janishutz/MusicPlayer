import {
    clientName,
    isAntiTamperEnabled
} from './state';
import ws from './ws';

const start = () => {
    Notification.requestPermission();
    document.addEventListener( 'visibilitychange', handleVisibilityChange );
    document.addEventListener( 'blur', () => sendMessage( 'blur' ) );
    isAntiTamperEnabled.value = true;
};

const handleVisibilityChange = () => {
    if ( document.visibilityState === 'hidden' ) {
        sendMessage( 'visibility' );
    }
};

let notificationLock = false;

const sendMessage = ( event: string ) => {
    if ( !notificationLock ) {
        notificationLock = true;
        new Notification( 'WARNING', {
            'body': 'Please return to MusicPlayer immediately!',
            'requireInteraction': true
        } );

        setTimeout( () => {
            notificationLock = false;
        }, 1000 );
    }

    ws.sendMessage( JSON.stringify( {
        'client': clientName.value,
        'event': event
    } ) );
};

export default {
    start
};
