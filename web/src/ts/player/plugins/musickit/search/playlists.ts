import type {
    MusicKitInstance
} from 'musickitjs-v3-types/MusicKitInstance';
import type {
    Song
} from '@/ts/dtype/playlist';

export const searchPlaylists = async ( instance: MusicKitInstance, cb: ( songs: Song[] ) => void ) => {
    // TODO: Get all playlists

    const search = async ( term: string ): Promise<Song[]> => {
        return [];
    };

    const addSelected = async ( idx: number ) => {
        // TODO: Implement
        cb( [] );
    };

    return {
        search,
        addSelected
    };
};
