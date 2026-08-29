import type {
    PlayerSourcePlugin,
    PlayerSourcePluginInitializer
} from '../interface';

export const useLocalPlayer: PlayerSourcePluginInitializer = async (): Promise<PlayerSourcePlugin> => {
    const player = document.createElement( 'audio' );

    const playSong = async ( id: string ) => {
        player.src = id;
        player.play();
    };

    return {
        'id': 'local',
        'name': 'Local Disk',
        'play': player.play,
        'getPlaybackPos': () => player.currentTime / player.duration,
        'getDuration': () => player.duration,
        playSong,
        'seekTo': pos => player.currentTime = pos,
        'pause': player.pause,
        'stop': () => player.src = '',
        // TODO: Implement
        'addSongsFromThisSource': async () => []
    };
};
