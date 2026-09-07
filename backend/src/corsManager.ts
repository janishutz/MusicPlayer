import {
    CorsOptions
} from 'cors';
import cors from 'cors';

let corsWhitelist: string[] = [];

const configure = ( whitelist: string[] ) => {
    corsWhitelist = whitelist;
};

const middleware = ( rest: boolean = false ) => {
    return cors( genCorsOpts( rest ) );
};

/**
 * Generate the options for the CORS library
 * @param rest - [OPTIONAL] Whether to allow REST requests or not
 * @returns CORS options object that can be used for the cors library
 */
const genCorsOpts = ( rest: boolean = false ): CorsOptions => {
    const corsOpts: CorsOptions = {
        'credentials': true,
        'optionsSuccessStatus': 200,
        'origin': ( origin, cb ) => {
            const status = blockREST( origin! );

            cb( null, status );
        }
    };

    if ( rest ) {
        corsOpts[ 'origin' ] = ( origin, cb ) => {
            const status = allowREST( origin! );

            cb( null, status );
        };
    }

    return corsOpts;
};

const blockREST = ( origin: string ): boolean => {
    return corsWhitelist.includes( origin );
};

const allowREST = ( origin: string ): boolean => {
    return blockREST( origin ) || !origin;
};


export default {
    genCorsOpts,
    configure,
    middleware
};
