import {
    writeFile
} from 'node:fs';

const log = ( ...msg: string[] ) => {
    output( 'log', log.caller.toString(), ...msg );
};

const info = ( ...msg: string[] ) => {
    output( 'info', log.caller.toString(), ...msg );
};

const debug = ( ...msg: string[] ) => {
    output( 'debug', log.caller.toString(), ...msg );
};

const warn = ( ...msg: string[] ) => {
    output( 'warn', log.caller.toString(), ...msg );
};

const error = ( ...msg: string[] ) => {
    output( 'error', log.caller.toString(), ...msg );
};

const fatal = ( ...msg: string[] ) => {
    output( 'fatal', log.caller.toString(), ...msg );
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

const output = ( level: LogLevel, caller: string, ...message: string[] ) => {
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
    configure
};
