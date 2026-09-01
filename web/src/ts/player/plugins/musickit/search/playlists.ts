import type {
    AppleMusicPlaylistData
} from './dtype';
import type {
    MusicKitInstance
} from 'musickitjs-v3-types/MusicKitInstance';
import type {
    Song
} from '@/ts/dtype/playlist';

export const searchPlaylists = async ( instance: MusicKitInstance, cb: ( songs: Song[] ) => void ) => {
    let playlists: Song[] = [];
    let filtered: Song[] = [];

    const search = async ( term: string ): Promise<Song[]> => {
        if ( playlists.length === 0 ) {
            playlists = ( ( await instance.api.music( '/v1/me/library/playlists', {
                'limit': 100
            } ) ).data as {
                'data': AppleMusicPlaylistData[]
            } ).data.map( val => {
                return {
                    'artist': 'Playlist',
                    'artwork': val.attributes.artwork ? window.MusicKit.formatArtworkURL( val.attributes.artwork, 1000, 100 ) : '',
                    'duration': 0,
                    'identifier': val.id,
                    'additional-info': '',
                    'name': val.attributes.name,
                    'source': 'applemusic'
                };
            } );
        }

        filtered = playlists.filter( val => {
            return val.name.includes( term );
        } );

        return filtered;
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
