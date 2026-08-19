export const useMusicKit = () => {
    const init = () => {
        isInit = true;
    };

    let isInit = false;

    if ( !window.MusicKit ) {
        document.addEventListener( 'musickitloaded', () => {
            init();
        } );
    } else {
        init();
    }

    return {};
};
