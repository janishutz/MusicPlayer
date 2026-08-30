import type {
    Song
} from '@/ts/dtype/playlist';
import {
    queue
} from '../state';

export const addSongList = ( songs: Song[] ) => {
    for ( const song of songs ) {
        queue.value.push( song );
    }
};

export const shuffleList = () => {};
