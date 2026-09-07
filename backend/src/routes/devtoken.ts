import corsManager from '../corsManager';
import express from 'express';
import fs from 'fs';
import {
    getLoginSdk
} from '../sdk';
import {
    getOwnershipManager
} from '../manager/users/ownership';
import jwt from 'jsonwebtoken';
import path from 'path';

const routes = ( app: express.Application, foss: boolean ) => {
    const sdk = getLoginSdk( foss );
    const privateKey = fs.readFileSync( path.join(
        __dirname,
        '/../config/apple_private_key.p8'
    ) ).toString();
    const musicApiConfig = JSON.parse( fs.readFileSync( path.join(
        __dirname,
        '/../config/apple-music-api.config.secret.json'
    ) ).toString() );
    const ownership = getOwnershipManager( foss );

    app.get(
        '/dev-token',
        corsManager.middleware( false ),
        sdk.loginCheck(),
        ownership.middleware(),
        ( _request: express.Request, response: express.Response ) => {
            // sign dev token
            const now = new Date().getTime();
            const tomorrow = now + ( 24 * 3600 * 1000 );
            const jwtToken = jwt.sign( {
                'iss': musicApiConfig.teamID,
                'iat': Math.floor( now / 1000 ),
                'exp': Math.floor( tomorrow / 1000 )
            }, privateKey, {
                'algorithm': 'ES256',
                'keyid': musicApiConfig.keyID
            } );

            response.send( jwtToken );
        }
    );
};

export default {
    routes
};
