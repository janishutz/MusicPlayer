import {
    ref
} from 'vue';

export const showTamperNotification = ref( false );

export const tamperingClientName = ref( '' );

export const tamperingKind = ref( '' );

const handler = ( ev: MessageEvent ) => {
    if ( ev.data === 'disconnected' ) {
        showTamperNotification.value = true;
        tamperingKind.value = 'disconnect';
        tamperingClientName.value = '';
    }

    try {
        const data = JSON.parse( ev.data );

        tamperingClientName.value = data.client ?? '';
        tamperingKind.value = data.event ?? '';
        showTamperNotification.value = true;
    } catch { /* empty */ }
};


export default {
    handler
};
