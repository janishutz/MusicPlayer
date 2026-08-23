export const useMusicKit = ( storefront: string = 'ch' ) => {
    const init = async () => {
        const res = await fetch( import.meta.env.VITE_BACKEND_URL + '/', {
            'credentials': 'include'
        } );

        if ( res.status === 200 ) {
            const token = await res.text();

            window.MusicKit.configure( {
                'developerToken': token,
                'app': {
                    'name': 'MusicPlayer',
                    'build': '4',
                    'icon': 'https://music.janishutz.com/logo.jpg'
                },
                'storefront': storefront.toUpperCase()
            } );
        }

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
