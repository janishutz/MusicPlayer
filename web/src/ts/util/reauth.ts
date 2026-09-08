export const reauth = () => {
    localStorage.setItem( 'close-tab', 'true' );

    const listener = () => {
        if ( localStorage.getItem( 'reauth-ok' ) === 'true' ) {
            try {
                window.removeEventListener( 'storage', listener );
            } catch { /* empty */ }

            localStorage.removeItem( 'reauth-ok' );

            document.dispatchEvent( new CustomEvent( 'musicplayer:reauth' ) );
        }
    };

    window.addEventListener( 'storage', listener );
};
