import type {
    AppleMusicPlaylistData,
    AppleMusicSongData
} from './dtype';
import type {
    Song
} from '@/ts/dtype/playlist';

export const searchPlaylists = async ( cb: ( songs: Song[] ) => void ) => {
    let playlists: Song[] = [];
    let filtered: Song[] = [];

    const instance = window.MusicKit.getInstance();

    const search = async ( term: string, offset: number = 0 ): Promise<Song[]> => {
        if ( playlists.length === 0 ) {
            playlists = ( ( await instance.api.music( '/v1/me/library/playlists', {
                'limit': 100,
                'offset': offset
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

        term = term.toLocaleLowerCase();
        filtered = playlists.filter( val => {
            return val.name.toLocaleLowerCase().includes( term );
        } );

        return filtered;
    };

    const addSelected = async ( idx: number ) => {
        try {
            const results = ( await instance.api.music( '/v1/me/library/playlists/' + filtered[idx]!.identifier + '/tracks' ) ).data as {
                'data': AppleMusicSongData[]
            };
            const songs: Song[] = results.data
                .map( val => {
                    return {
                        'identifier': val.id,
                        'additional-info': '',
                        'artist': val.attributes.artistName,
                        'name': val.attributes.name,
                        'artwork': window.MusicKit.formatArtworkURL( val.attributes.artwork, 1000, 1000 ),
                        'duration': val.attributes.durationInMillis * 1000,
                        'source': 'applemusic'
                    };
                } );

            cb( songs );
        } catch ( error ) {
            console.error( '[ADD PLAYLIST] Failed to add playlist due to error', error );
        }
    };

    return {
        search,
        addSelected
    };
};
