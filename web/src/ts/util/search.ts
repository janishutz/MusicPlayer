import type {
    AppleMusicApiSearchResult, AppleMusicSongData
} from '../player/plugins/musickit/search/dtype';
import type {
    Song
} from '../dtype/playlist';

export const initAppleMusicApiSearch = () => {
    const instance = window.MusicKit.getInstance();

    return async ( term: string, limit: number = 20, offset: number = 0 ): Promise<Song[]> => {
        const params = {
            'term': term,
            'types': [ 'songs' ],
            'offset': offset ?? 20,
            'limit': limit ?? 0
        };

        let results: AppleMusicSongData[] = [];

        try {
            results = ( ( await instance.api.music( '/v1/catalog/{{storefrontId}}/search', params ) ).data as AppleMusicApiSearchResult ).results.songs.data;
        } catch {
            console.debug( 'Failed results: got', results );

            return [];
        }

        const songs: Song[] = [];

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
};
