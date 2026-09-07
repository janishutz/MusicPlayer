export class AuthError extends Error {}

export class UnownedError extends Error {}


const get = async ( url: string ): Promise<Response> => {
    return await wrapper( url, {
        'credentials': 'include'
    } );
};

const backendURL = import.meta.env.VITE_BACKEND_URL;

const post = async ( url: string, payload: string, mime: string = 'application/json' ): Promise<Response> => {
    return await wrapper( url, {
        'credentials': 'include',
        'body': payload,
        'method': 'post',
        'headers': {
            'Content-Type': mime ?? 'application/json'
        }
    } );
};

const wrapper = async ( url: string, opts: RequestInit ): Promise<Response> => {
    const res = await fetch( backendURL + url, opts );

    if ( res.ok ) {
        return res;
    } else if ( res.status === 403 || res.status === 401 ) {
        // TODO: Handle these errors better (probably do something like in the old version, but better)
        throw new AuthError( 'ERR_USER_UNAUTHORIZED' );
    } else if ( res.status === 402 ) {
        throw new UnownedError( 'ERR_USER_UNOWNED' );
    } else {
        throw new Error( 'ERR_' + res.status );
    }
};

export default {
    get,
    post,
    backendURL
};
