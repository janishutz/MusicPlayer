import crypto from 'node:crypto';

/**
 * Generate a token for e.g. login, etc
 * @param length - The number of characters of the token
 * @returns The generated token
 */
export const generateToken = ( length: number ): string => {
    let token = '';

    const min = 45;
    const max = 122;

    for ( let i = 0; i < length; i++ ) {
        const buf = new Uint8Array( 1 );

        crypto.getRandomValues( buf );
        let randomNumber = Math.floor( ( buf[ 0 ] / 256 * ( max - min ) ) + min );

        while (
            ( 58 < randomNumber && randomNumber < 63 )
            || ( 90 < randomNumber && randomNumber < 95 )
            || ( 95 < randomNumber && randomNumber < 97 )
        ) {
            const buf = new Uint8Array( 1 );

            crypto.getRandomValues( buf );
            randomNumber = Math.floor( ( buf[ 0 ] / 256 * ( max - min ) ) + min );
        }

        token += String.fromCharCode( randomNumber );
    }

    return token;
};
