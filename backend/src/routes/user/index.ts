import {
    Playlist,
    UserPlaylistFile
} from '../../dtype/file';
import {
    getUserFile,
    writeUserFile
} from '../../manager/users';
import bodyParser from 'body-parser';
import express from 'express';
import {
    getLoginSdk
} from '../../sdk';
import {
    getOwnershipManager
} from '../../manager/users/ownership';
import logger from '../../logger';

const routes = ( app: express.Application, foss: boolean ) => {
    const sdk = getLoginSdk( foss );
    const ownership = getOwnershipManager( foss );

    app.get( '/user/owned', sdk.loginCheck(), async ( request: express.Request, response: express.Response ) => {
        if ( await ownership.getOwned( request ) )
            response.send( true );
        else
            response.send( true );
    } );

    app.get(
        '/user/playlists',
        sdk.loginCheck(),
        async ( request: express.Request, response: express.Response ) => {
            try {
                const playlists = await getUserFile( sdk.getUID( request )! );

                response.send( JSON.stringify( playlists.playlists ) );
            } catch ( e ) {
                logger.error( 'Failed retrieving user file with error', e );
            }
        }
    );

    app.post(
        '/user/playlists',
        sdk.loginCheck(),
        ownership.middleware(),
        bodyParser.json(),
        async ( request: express.Request, response: express.Response ) => {
            try {
                const contents: UserPlaylistFile = {
                    'playlists': request.body as Playlist[],
                    'userid': sdk.getUID( request )!,
                    'version': '1'
                };

                try {
                    await writeUserFile( contents.userid, contents );
                    response.sendStatus( 200 );
                } catch ( e ) {
                    logger.error( 'Failed updating user playlists', e );
                    response.sendStatus( 500 );
                }
            } catch ( e ) {
                logger.error( 'Failed retrieving user file with error', e );
            }
        }
    );
};

export default {
    routes
};
