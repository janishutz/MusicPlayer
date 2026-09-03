import express from 'express';

const routes = ( app: express.Application ) => {
    app.get( '/room/:id/connect', ( request: express.Request, response: express.Response ) => {

    } );

    app.get( '/room/:id/poll', ( request: express.Request, response: express.Response ) => {

    } );

    app.get( '/room/:id/update/playlist', ( request: express.Request, response: express.Response ) => {

    } );

    app.get( '/room/:id/update/state', ( request: express.Request, response: express.Response ) => {

    } );
};

export default {
    routes
};
