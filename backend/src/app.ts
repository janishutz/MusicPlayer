import devtoken from './routes/devtoken';
import express from 'express';
import expressSession from 'express-session';
import path from 'path';


const run = () => {
    const app = express();

    // TODO: Use db store for this (via sdk or stubs)
    app.use( expressSession( {
        'secret': 'dev',
        'resave': true,
        'saveUninitialized': false
    } ) );


    app.get( '/', ( _request: express.Request, response: express.Response ) => {
        response.send( 'HELLO WORLD' );
    } );


    app.use( ( _request: express.Request, response: express.Response ) => {
        response.sendFile( path.join( __dirname, '' ) );
    } );


    devtoken.routes( app );


    const PORT = process.env.PORT || 8080;

    app.listen( PORT );
};

export default {
    run
};
