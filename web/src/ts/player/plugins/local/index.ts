import type {
    PlayerSourcePlugin,
    PlayerSourcePluginInitializer
} from '../interface';
import {
    associate,
    updateIdentifiers
} from './association';
import {
    load,
    unload
} from './loader';
import {
    ref
} from 'vue';

export const useLocalPlayer: PlayerSourcePluginInitializer = async (): Promise<PlayerSourcePlugin> => {
    const player = new Audio();

    const playSong = async ( id: string ) => {
        player.src = id;
        player.play();
    };

    return {
        'authorized': ref( true ),
        'id': 'local',
        'name': 'Local Disk',
        'play': () => player.play(),
        'getPlaybackPos': () => player.currentTime / player.duration,
        'getDuration': () => player.duration,
        playSong,
        'seekTo': pos => player.currentTime = pos * player.duration,
        'pause': () => player.pause(),
        'stop': () => player.src = '',
        'addSongsFromThisSource': load,
        'loading': {
            'requiresLocalFiles': true,
            'association': associate,
            'updateIdentifiers': updateIdentifiers,
            'mime': 'audio/aac,audio/mpeg,audio/wav,audio/mp4,audio/ogg'
        },
        'songUnload': unload
    };
};
