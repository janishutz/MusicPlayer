import type {
    Song
} from '@/ts/dtype/playlist';
import {
    initAppleMusicApiSearch
} from '@/ts/util/search';

export const searchSongs = async ( cb: ( songs: Song[] ) => void ) => {
    let songs: Song[] = [];

    const searchFunc = initAppleMusicApiSearch();

    const search = async ( term: string, offset: number = 0 ) => {
        songs = await searchFunc( term, 15, offset );

        return songs;
    };

    const addSelected = async ( idx: number ) => {
        cb( [ songs[idx]! ] );
    };

    return {
        search,
        addSelected
    };
};
