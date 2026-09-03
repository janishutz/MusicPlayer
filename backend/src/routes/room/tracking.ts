import express from 'express';

const routes = ( app: express.Application ) => {
    app.get( '/room/:id/tracking/exit', ( request: express.Request, response: express.Response ) => {

    } );

    app.get( '/room/:id/tracking/ping', ( request: express.Request, response: express.Response ) => {

    } );

    app.get( '/room/:id/tracking/connect', ( request: express.Request, response: express.Response ) => {

    } );

    app.get( '/room/:id/admin', ( request: express.Request, response: express.Response ) => {
        // Endpoint for the streamer to connect to, all above events are sent there

    } );
};

export default {
    routes
};
