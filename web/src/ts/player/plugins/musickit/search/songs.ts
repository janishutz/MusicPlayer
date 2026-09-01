import type {
    AppleMusicApiSearchResult
} from './dtype';
import type {
    MusicKitInstance
} from 'musickitjs-v3-types/MusicKitInstance';
import type {
    Song
} from '@/ts/dtype/playlist';

export const searchSongs = async ( instance: MusicKitInstance, cb: ( songs: Song[] ) => void ) => {
    let songs: Song[] = [];

    const search = async ( term: string ): Promise<Song[]> => {
        const params = {
            'term': term,
            'types': [ 'songs' ]
        };
        const results = ( ( await instance.api.music( '/v1/catalog/{{storefrontId}}/search', params ) ).data as AppleMusicApiSearchResult ).results.songs.data;

        songs = [];

        for ( const result of results ) {
            songs.push( {
                'duration': Math.round( result.attributes.durationInMillis / 1000 ),
                'name': result.attributes.name,
                'additional-info': '',
                'artist': result.attributes.artistName,
                'artwork': window.MusicKit.formatArtworkURL( result.attributes.artwork, 1000, 1000 ),
                'identifier': result.id,
                'source': 'applemusic'
            } );
        }

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
