import {
    getLoginSdk,
    getStoreSdk
} from './sdk';
import devtoken from './routes/devtoken';
import express from 'express';
import fs from 'fs';
import path from 'path';

// TODO: configurable
const sdk = getLoginSdk( false );
const storeSdk = getStoreSdk( false );


const run = () => {
    const app = express();
    const sdkConfig = JSON.parse( fs.readFileSync( path.join(
        __dirname,
        '/config/sdk.config.testing.json'
    ) ).toString() );

    // Load id.janishutz.com SDK and allow signing in
    sdk.setUp(
        {
            'prod': false,
            'service': {
                'serviceID': 'jh-music',
                'serviceToken': sdkConfig[ 'token' ]
            },
            'user-agent': sdkConfig[ 'ua' ],
            'sessionType': 'memory',
            'frontendURL': 'https://music.janishutz.com',
            'corsWhitelist': [ 'https://music.janishutz.com' ],
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
        '/config/store-sdk.config.secret.json'
    ) ).toString() );

    storeSdk.configure( storeConfig );

    app.get( '/', ( _request: express.Request, response: express.Response ) => {
        response.send( 'HELLO WORLD' );
    } );


    // Load extra routes
    devtoken.routes( app );


    app.use( ( _request: express.Request, response: express.Response ) => {
        response.sendFile( path.join( __dirname, '' ) );
    } );

    const PORT = process.env.PORT || 8080;

    app.listen( PORT );
};

export default {
    run
};
