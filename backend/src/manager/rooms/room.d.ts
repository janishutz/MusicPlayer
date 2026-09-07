import {
    PlaylistSongs
} from '../../dtype/file';
import {
    Response
} from 'express';

export interface Client {
    'id': string;
    'response': Response;
}

export interface Room {
    'playlist': {
        'lastUpdate': number;
        'playlist': PlaylistSongs;
    }
    'state': {
        'index': number;
        'start': number;
        'playing': boolean;
        'lastUpdate': number;
    };
    'owner': string;
    'clients': Client[];
    'trackingClients': Client[];

}

export interface RoomStore {
    [id: string]: Room
}
