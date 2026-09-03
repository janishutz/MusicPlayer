import express from 'express';
import tracking from './tracking';
import update from './update';

const routes = ( app: express.Application ) => {
    tracking.routes( app );
    update.routes( app );

    app.get( '/room/create', ( request: express.Request, response: express.Response ) => {

    } );

    app.get( '/room/:id/close', ( request: express.Request, response: express.Response ) => {

    } );
};

export default {
    routes
};
