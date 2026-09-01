import type {
    Artwork
} from 'musickitjs-v3-types/enums';

export interface AppleMusicApiSearchResult {
    'results': {
        'songs': {
            'data': AppleMusicSongData[],
            'href': string;
        }
    };
}

export interface AppleMusicSongData {
    'id': string,
    'type': string;
    'href': string;
    'attributes': {
        'albumName': string;
        'artistName': string;
        'artwork': Artwork,
        'name': string;
        'genreNames': string[];
        'durationInMillis': number;
    }
}
