import {
    Playlist
} from '../../dtype/file';
import {
    Response
} from 'express';

export interface Room {
    'playlist': Playlist;
    'playing': boolean;
    'index': number;
    'start': number;
    'token': string;
    'lastUpdate': number;

    /**
     * This is used to determine if the playlist needs to be sent in polling mode
     */
    'lastPlaylistUpdate': number;

    'clients': Response[]
}

export interface RoomStore {
    [id: string]: Room
}
