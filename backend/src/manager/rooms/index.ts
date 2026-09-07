import {
    Client,
    Room,
    RoomStore
} from './room';
import {
    PlaylistSongs
} from '../../dtype/file';
import {
    Response
} from 'express';

const rooms: RoomStore = {};

/**
 * The room to get
 * @param room - The name of the room to get
 * @returns The room, or undefined if it is not present
 */
const get = ( room: string ): Room | undefined => {
    return rooms[room];
};

/**
 * @param name - The name of the room to create
 * @param uid - The ID of the user
 */
const create = ( name: string, uid: string ) => {
    if ( rooms[ name ] ) {
        return false;
    } else {
        rooms[ name ] = {
            'clients': [],
            'trackingClients': [],
            'owner': uid,
            'playlist': {
                'playlist': [],
                'lastUpdate': new Date().getTime()
            },
            'state': {
                'index': 0,
                'lastUpdate': new Date().getTime(),
                'playing': false,
                'start': new Date().getTime()
            }
        };

        return true;
    }
};

/**
 * Add a listening client to a room
 * @param roomName - The room ID this client should belong to
 * @param id - The ID of the client
 * @param kind - The type of client that is to be removed
 * @param response - The express response object
 * @returns true if successful, false otherwise
 */
const addClient = ( roomName: string, id: string, kind: 'client' | 'trackingClient', response: Response ) => {
    if ( !rooms[roomName] ) return false;

    const room = rooms[roomName][kind + 's' as 'clients' | 'trackingClients'] as Client[];

    room.push( {
        'response': response,
        'id': id
    } );

    return true;
};

/**
 * Remove a listening client by its ID
 * @param roomName - The room ID this client belongs to
 * @param id - The ID of the client
 * @param kind - The type of client that is to be removed
 * @returns true if successful, false otherwise
 */
const removeClient = ( roomName: string, id: string, kind: 'client' | 'trackingClient' ) => {
    if ( !rooms[roomName] ) return false;

    const room = rooms[roomName][kind + 's' as 'clients' | 'trackingClients'] as Client[];
    const idx = room.findIndex( client => client.id === id );

    if ( idx < 0 )
        return false;

    room.splice( idx, 1 );

    return true;
};

/**
 * Close the room and disconnect all clients
 * @param name - The name of the room
 * @param uid - The name of the owner of the room
 */
const close = ( name: string, uid: string ) => {
    if ( !rooms[name] || rooms[name].owner !== uid ) return false;

    rooms[name].clients.forEach( client => client.response.send( 'data: closed\n\n' ) );
    delete rooms[name];

    return true;
};

/**
 * Update the state of the specified room
 * @param room - The room to update the state for
 * @param uid - The UserID of the user that created the room (i.e. the owner)
 * @param playing - Set to true if the player is playing currently
 * @param index - The current playback index
 * @param start - The timestamp where playback of the current song started
 * @returns true if update succeeded
 */
const updateState = ( room: string, uid: string, playing: boolean, index: number, start: number ) => {
    if ( !rooms[room] || rooms[room].owner !== uid ) {
        return false;
    }

    rooms[room].state = {
        'playing': playing,
        'index': index,
        'lastUpdate': new Date().getTime(),
        'start': start
    };

    return sendUpdate( room, 'state' );
};

/**
 * Update the playlist of the specified room
 * @param room - The room to update the state for
 * @param uid - The UserID of the user that created the room (i.e. the owner)
 * @param playlist - The playlist that is currently playing
 * @returns true if update succeeded
 */
const updatePlaylist = ( room: string, uid: string, playlist: PlaylistSongs ) => {
    if ( !rooms[room] || rooms[room].owner !== uid ) return false;

    rooms[room].playlist = {
        'playlist': playlist,
        'lastUpdate': new Date().getTime()
    };

    return sendUpdate( room, 'playlist' );
};

const sendUpdate = ( room: string, kind: 'state' | 'playlist' ) => {
    const roomObject = rooms[room];

    if ( !roomObject ) return false;

    roomObject.clients.forEach( client => client.response.write( `data: ${ JSON.stringify( {
        'type': kind,
        'data': JSON.stringify( roomObject[kind] )
    } ) }\n\n` ) );

    return true;
};

/**
 * Send an update from the trackking system to all admin clients
 * @param room - The room to send it to
 * @param update - The update to send
 */
const sendTrackingUpdate = ( room: string, update: string ) => {
    if ( !rooms[room] ) return false;

    rooms[room].trackingClients.forEach( client => client.response.write( `data: ${ update }\n\n` ) );
};

export default {
    get,
    create,
    close,
    updateState,
    updatePlaylist,
    sendTrackingUpdate,
    addClient,
    removeClient
};
