import {
    readFile,
    stat,
    writeFile
} from 'node:fs';
import {
    UserPlaylistFile
} from '../../dtype/file';
import path from 'node:path';

export const getUserFile = async ( uid: string ): Promise<UserPlaylistFile> => {
    return new Promise( ( resolve, reject ) => {
        readFile( getUserFilePath( uid ), ( err, data ) => {
            if ( err ) return reject( err );

            resolve( JSON.parse( String( data ) ) as UserPlaylistFile );
        } );
    } );
};

const createUserFile = async ( uid: string ): Promise<void> => {
    writeUserFile( uid, {
        'playlists': [],
        'userid': uid,
        'version': '1'
    } );
};

export const getUserFilePath = ( uid: string ): string => {
    return path.join( __dirname, '/../../../data/', uid + '.json' );
};

export const testUserFileExists = async ( uid: string ): Promise<boolean> => {
    return new Promise( resolve => {
        stat( getUserFilePath( uid ), err => {
            if ( err ) return resolve( false );

            resolve( true );
        } );
    } );
};

export const writeUserFile = async ( uid: string, file: UserPlaylistFile ) => {
    writeFile( getUserFilePath( uid ), JSON.stringify( file ), err => {
        if ( err ) return Promise.reject( err );
        else Promise.resolve();
    } );
};

export default {
    getUserFilePath,
    getUserFile,
    writeUserFile,
    testUserFileExists,
    createUserFile
};
