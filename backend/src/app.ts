import express from 'express';
import expressSession from 'express-session';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';


const run = () => {
    const app = express();

    app.use( expressSession( {
        'secret': 'dev',
        'resave': true,
        'saveUninitialized': false
    } ) );


    app.get( '/', ( request: express.Request, response: express.Response ) => {
        response.send( 'HELLO WORLD' );
    } );



    const privateKey = fs.readFileSync( path.join(
        __dirname,
        '/config/apple_private_key.p8'
    ) ).toString();
    const musicApiConfig = JSON.parse( fs.readFileSync( path.join(
        __dirname,
        '/config/apple-music-api.config.secret.json'
    ) ).toString() );

    app.get( '/dev-token', ( request: express.Request, response: express.Response ) => {
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
    } );

    app.use( ( _request: express.Request, response: express.Response ) => {
        response.sendFile( path.join( __dirname, '' ) );
    } );


    const PORT = process.env.PORT || 8080;

    app.listen( PORT );
};

export default {
    run
};
