import {
    clientName,
    isAntiTamperActive
} from './state';
import ws from './ws';

const start = () => {
    Notification.requestPermission();
    document.addEventListener( 'visibilitychange', handleVisibilityChange );
    document.addEventListener( 'blur', () => sendMessage( 'blur' ) );
    isAntiTamperActive.value = true;
};

const handleVisibilityChange = () => {
    if ( document.visibilityState === 'hidden' ) {
        sendMessage( 'visibility' );
    }
};

let notificationLock = false;

const sendMessage = ( event: string, notification?: string ) => {
    if ( !isAntiTamperActive.value ) return;

    if ( !notificationLock ) {
        notificationLock = true;
        new Notification( 'WARNING', {
            'body': notification ?? 'Please return to MusicPlayer immediately!',
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

const stop = () => {
    try {
        document.removeEventListener( 'visibilitychange', handleVisibilityChange );
    } catch { /* empty */ }

    try {
        document.removeEventListener( 'blur', () => sendMessage( 'blur' ) );
    } catch { /* empty */ }

    isAntiTamperActive.value = false;
};

export default {
    start,
    sendMessage,
    stop
};
