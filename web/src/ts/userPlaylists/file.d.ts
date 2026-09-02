import type {
    PlaylistSongs
} from '../dtype/playlist';

interface UserPlaylistFile {
    'version': '1',
    'userid': string,
    'playlists': Playlist[]
}

interface Playlist {
    'name': string;
    'songs': PlaylistSongs;
}
