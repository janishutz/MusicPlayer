import type {
    Song
} from '@/ts/dtype/playlist';

// TODO: Add search interface elements to plugin's args (such as a search interface)
export type PlayerSourcePluginInitializer = () => Promise<PlayerSourcePlugin>;

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
     * Implement any login flow here. Optional
     */
    'login'?: () => Promise<boolean>;

    /**
     * Play a song by its ID
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
     * Called when user adds another song to the playlist via this source.
     * You may use the provided interface elements (search bar and popups) to e.g. ask if user wants to use a playlist, album, etc
     */
    'addSongsFromThisSource': () => Promise<Song[]>;
}
