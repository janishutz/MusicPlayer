import express from 'express';
import {
    writeFile
} from 'node:fs';

const log = ( ...msg: unknown[] ) => {
    output( 'log', 'UNKNOWN', ...msg );
};

const info = ( ...msg: unknown[] ) => {
    output( 'info', 'UNKNOWN', ...msg );
};

const debug = ( ...msg: unknown[] ) => {
    output( 'debug', 'UNKNOWN', ...msg );
};

const warn = ( ...msg: unknown[] ) => {
    output( 'warn', 'UNKNOWN', ...msg );
};

const error = ( ...msg: unknown[] ) => {
    output( 'error', 'UNKNOWN', ...msg );
};

const fatal = ( ...msg: unknown[] ) => {
    output( 'fatal', 'UNKNOWN', ...msg );
};

const routeLogging = () => {
    return ( request: express.Request, _response: express.Response, next: express.NextFunction ) => {
        output( 'info', 'ROUTER', request.originalUrl, 'from', request.headers['user-agent'] ?? 'No UA' );
        next();
    };
};


let loc = 'stderr';
let lev = 0;
type LogLevel = 'debug' | 'info' | 'log' | 'warn' | 'error' | 'fatal';
const levels = [
    'debug',
    'info',
    'log',
    'warn',
    'error',
    'fatal'
];

const configure = ( location: 'stderr' | 'file', minLevel: LogLevel, file?: string ) => {
    if ( location === 'file' && !file ) {
        throw new Error( 'File parameter required when location is "file"' );
    }

    loc = location === 'stderr' ? 'stderr' : ( file ?? 'musicplayer.log' );
    lev = levels.indexOf( minLevel );
};


const logfile: string[] = [];

const output = ( level: LogLevel, caller: string, ...message: unknown[] ) => {
    if ( levels.indexOf( level ) < lev ) {
        return;
    }

    const msg = message.join( ' ' );
    const out = `[${ level.toUpperCase() }] (${ new Date().toISOString() }) in ${ caller }: ${ msg }`;

    if ( loc === 'stderr' ) {
        console.error( out );
    } else {
        logfile.push( out );
        save();
    }
};

let isSaving = false;
let waitingOnSave = false;

const save = () => {
    if ( isSaving ) {
        waitingOnSave = true;

        return;
    }

    isSaving = true;
    writeFile( loc, JSON.stringify( logfile ), err => {
        if ( err )
            console.error( '[LOGGER] Failed to save with error ' + err );

        if ( waitingOnSave ) {
            waitingOnSave = false;
            isSaving = false;
            save();
        }

        isSaving = false;
    } );
};


export default {
    log,
    info,
    debug,
    warn,
    error,
    fatal,
    configure,
    routeLogging
};
