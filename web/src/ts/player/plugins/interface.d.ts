import type {
    Ref
} from 'vue';
import type {
    Song
} from '@/ts/dtype/playlist';

export type PlayerSourcePluginInitializer = () => Promise<PlayerSourcePlugin>;

export interface AssociationResult {
    'song': Song,
    'match': 'exact' | 'none' | 'multiple';
    'possibleFiles': File[],
    'selectedIdx'?: number;
}

export interface PlayerSourcePlugin {
    /**
     * The name of the source that is displayed in the UI
     */
    'name': string;

    /**
     * The identifier used in the playlist files
     */
    'id': string;

    /**
     * Font-Awesome icon name (without fa and needs to be of free icons
     */
    'icon'?: string;

    /**
     * Describe how files are loaded here
     */
    'loading': {
        /**
         * Set to true if the user needs to load files
         */
        'requiresLocalFiles': true;

        /**
         * Function used to associate the file to the songs of the playlist
         * @param files - The files that were picked by the user
         * @param song - The song to update
         * @returns A promise resolving to the (possibly) updated song and metadata
         */
        'association': ( files: FileList, song: Song ) => Promise<AssociationResult>;

        /**
         * Function used to update the additional identifier of the song if the file has changed
         * @param song - The song that needs updating
         * @param file - The file that it should be updated to
         * @returns The updated song
         */
        'updateIdentifiers': ( song: Song, file: File ) => Promise<Song>;

        /**
         * The mime types that this source's files may have
         */
        'mime': string;
    } | {
        /**
         * Set to true if the user needs to load files
         */
        'requiresLocalFiles': false;
    };

    /**
     * Implement any login flow here. Optional
     */
    'login'?: () => Promise<boolean>;

    /**
     * Play a song by its ID. Should start playing it immediately
     */
    'playSong': ( id: string ) => Promise<void>;

    /**
     * Continue playing the song
     */
    'play': () => void;

    /**
     * Pause the currently playing song
     */
    'pause': () => void;

    /**
     * Stop / unload the current song. This indicates that either the playlist was cleared
     * or a next song is about to be loaded (possibly from another plugin)
     */
    'stop': () => void;

    /**
     * Seek to a specific point in the song.
     * @param pos is always given as a percentage (pos \in [0, 1])
     */
    'seekTo': ( pos: number ) => void;

    /**
     * Return the playback position as a percentage of the duration. (return value \in [0, 1])
     */
    'getPlaybackPos': () => number;

    /**
     * Return the song duration in seconds.
     */
    'getDuration': () => number;

    /**
     * Check if source is authorized
     */
    'authorized': Ref<boolean>;

    /**
     * Called when user adds another song to the playlist via this source.
     * You may use the provided interface elements (search bar and popups) to e.g. ask if user wants to use a playlist, album, etc
     */
    'addSongsFromThisSource': ( cb: ( songs: Song[] ) => void ) => void;
}
