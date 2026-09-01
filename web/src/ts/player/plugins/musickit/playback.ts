import type {
    MusicKitInstance
} from 'musickitjs-v3-types/MusicKitInstance';
import {
    ref
} from 'vue';

export const musicKitPlayback = ( musickitInstance: MusicKitInstance ) => {
    const play = () => {
        musickitInstance.play();
    };

    const pause = () => {
        musickitInstance.pause();
    };

    const seekTo = ( pos: number ) => {
        musickitInstance.seekToTime( pos * musickitInstance.currentPlaybackDuration );
    };

    const playSong = async ( id: string ) => {
        await musickitInstance.setQueue( {
            'song': id
        } );
        musickitInstance.play();
    };

    const stop = () => {
        musickitInstance.stop();
    };

    const getPlaybackPos = (): number => {
        return musickitInstance.currentPlaybackTime / musickitInstance.currentPlaybackDuration;
    };

    const getDuration = (): number => {
        return musickitInstance.currentPlaybackDuration;
    };

    const loggedIn = ref( musickitInstance.isAuthorized );

    musickitInstance.addEventListener( 'authorizationStatusDidChange', () => {
        loggedIn.value = musickitInstance.isAuthorized;
    } );

    return {
        play,
        pause,
        seekTo,
        playSong,
        stop,
        getPlaybackPos,
        getDuration,
        loggedIn
    };
};
