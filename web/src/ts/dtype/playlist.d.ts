// NOTE: For re-associating files with details here, can use dropdown in UI

export type PlaylistSongs = Song[];

export interface UrlToFileMapping {
    [key: string]: string
}

export interface Song {
    /**
     * Where the song can be found
     */
    'source': 'local' | 'applemusic';

    /**
     * The identifier for the song so it can be found again (such as Apple Music ID or URL for playback)
     */
    'identifier': string;

    /**
     * Any additional identifiers (such as filename, etc) to associate.
     * Even if this is not used, set this value if local files are needed
     */
    'additional-identifier'?: string;

    /**
     * Additional info, such as dance type to be displayed on remote screens
     */
    'additional-info': string;

    /**
     * The artist of the song
     */
    'artist': string;

    /**
     * The name of the song
     */
    'name': string;

    /**
     * The cover image as a URL
     */
    'artwork': string;

    /**
     * Song duration
     */
    'duration': number;
}
