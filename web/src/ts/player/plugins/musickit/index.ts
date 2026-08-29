import 'musickitjs-v3-types';
import type {
    PlayerSourcePlugin,
    PlayerSourcePluginInitializer
} from '../interface';
import {
    musicKitPlayback
} from './playback';

export const useMusicKit: PlayerSourcePluginInitializer = ( storefront: string = 'ch' ): Promise<PlayerSourcePlugin> => {
    return new Promise( ( resolve, reject ) => {
        const init = async ( storefront: string ): Promise<PlayerSourcePlugin> => {
            const res = await fetch( import.meta.env.VITE_BACKEND_URL + '/', {
                'credentials': 'include'
            } );

            if ( res.status === 200 ) {
                const token = await res.text();
                const instance = await window.MusicKit.configure( {
                    'developerToken': token,
                    'app': {
                        'name': 'MusicPlayer',
                        'build': '4',
                        'icon': 'https://music.janishutz.com/logo.jpg'
                    },
                    'storefrontId': storefront.toUpperCase()
                } );
                const controls = musicKitPlayback( instance );

                const login = async (): Promise<boolean> => {
                    try {
                        await instance.authorize();

                        return true;
                    } catch {
                        return false;
                    }
                };

                return {
                    'play': controls.play,
                    'pause': controls.pause,
                    'stop': controls.stop,
                    'playSong': controls.playSong,
                    'getDuration': controls.getDuration,
                    'getPlaybackPos': controls.getPlaybackPos,
                    'id': 'applemusic',
                    'name': 'Apple Music',
                    'seekTo': controls.seekTo,
                    'login': login,
                    // TODO: Implement
                    'addSongsFromThisSource': async () => []
                };
            } else {
                throw new Error( 'ERR_AUTH' );
            }
        };

        if ( !window.MusicKit ) {
            document.addEventListener( 'musickitloaded', () => {
                init( storefront )
                    .then( resolve )
                    .catch( reject );
            } );
        } else {
            init( storefront )
                .then( resolve )
                .catch( reject );
        }
    } );
};
