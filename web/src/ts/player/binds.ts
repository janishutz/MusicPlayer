import {
    disableKeyHandler,
    isPlaying
} from './state';
import {
    next,
    pause,
    play,
    prev
} from './controls';

const keybindListener = ( ev: KeyboardEvent ) => {
    if ( !disableKeyHandler.value )
        if ( ev.key === ' ' ) {
            ev.preventDefault();

            if ( isPlaying.value )
                pause();
            else
                play();
        } else if ( ev.key === 'ArrowRight' ) {
            ev.preventDefault();
            next();
        } else if ( ev.key === 'ArrowLeft' ) {
            ev.preventDefault();
            prev();
        }
};

export const useKeyboardListener = () => {
    window.addEventListener( 'keydown', keybindListener );
};
