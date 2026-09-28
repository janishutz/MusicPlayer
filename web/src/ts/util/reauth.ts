import {
    ref
} from 'vue';

export const showReauthPopup = ref( false );

export const reauth = () => {
    localStorage.setItem( 'close-tab', 'true' );
    showReauthPopup.value = true;

    const listener = () => {
        if ( localStorage.getItem( 'reauth-ok' ) === 'true' ) {
            try {
                window.removeEventListener( 'storage', listener );
            } catch { /* empty */ }

            localStorage.removeItem( 'reauth-ok' );

            console.debug( '[REAUTH] Complete!' );
            document.dispatchEvent( new CustomEvent( 'musicplayer:reauth' ) );
        }
    };

    window.addEventListener( 'storage', listener );
};
