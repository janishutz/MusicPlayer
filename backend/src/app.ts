import {
    getLoginSdk,
    getStoreSdk
} from './sdk';
import {
    Config
} from './dtype/config';
import devtoken from './routes/devtoken';
import express from 'express';
import fs from 'fs';
import path from 'path';
import room from './routes/room';
import user from './routes/user';

const run = () => {
    const sdkConfig = JSON.parse( fs.readFileSync( path.join(
        __dirname,
        '/../config/sdk.config.testing.json'
    ) ).toString() );
    const config = JSON.parse( fs.readFileSync( path.join(
        __dirname,
        '/../config/config.json'
    ) ).toString() ) as Config;
    const foss = config.mode !== 'hosted';
    const sdk = getLoginSdk( foss );
    const storeSdk = getStoreSdk( foss );
    const app = express();

    // Load id.janishutz.com SDK and allow signing in
    sdk.setUp(
        {
            'prod': false,
            'service': {
                'serviceID': sdkConfig[ 'name' ],
                'serviceToken': sdkConfig[ 'token' ]
            },
            'user-agent': sdkConfig[ 'ua' ],
            'sessionType': 'memory',
            'frontendURL': config.webUrl,
            'corsWhitelist': [ config.webUrl ],
            'recheckTimeout': 300 * 1000,
            'advancedVerification': 'sdk'
        },
        app,
        async () => {
            return true;
        },
        async ( uid: string ) => {
            fs.writeFileSync( path.join( __dirname, '/data/', uid ), '{}' );

            return true;
        },
        async () => {
            return true;
        },
        async () => {
            return true;
        }
    );


    // Load store sdk
    const storeConfig = JSON.parse( fs.readFileSync( path.join(
        __dirname,
        '/../config/store-sdk.config.testing.json'
    ) ).toString() );

    storeSdk.configure( storeConfig );

    app.get( '/', ( _request: express.Request, response: express.Response ) => {
        response.redirect( config.webUrl ?? 'https://music.janishutz.com' );
    } );

    // TODO: Need way for frontend to get the connection type for shares


    // Load extra routes
    devtoken.routes( app, foss );
    room.routes( app, foss );
    user.routes( app, foss );


    app.use( ( _request: express.Request, response: express.Response ) => {
        response.sendStatus( 404 );
    } );

    const PORT = process.env.PORT || 8080;

    app.listen( PORT );
};

export default {
    run
};
