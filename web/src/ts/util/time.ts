/**
 * Get a human-readable representation of time
 * @param time - The time to convert, in seconds
 * @returns The time, in human-readable format
 */
export const beautifyTime = ( time: number ): string => {
    const helper = ( t: number, depth: number ): string => {
        if ( depth > 2 )
            return `${ Math.floor( t / 60 ) }:${ t % 60 < 10 ? '0' : '' }${ Math.floor( t % 60 ) }`;
        else if ( Math.floor( t / 60 ) > 0 )
            return `${ helper( Math.floor( t / 60 ), depth + 1 ) }:${ t % 60 < 10 ? '0' : '' }${ Math.floor( t % 60 ) }`;
        else
            return `${ t % 60 < 10 ? '0' : '' }${ Math.floor( t % 60 ) }`;
    };

    if ( time < 0 ) {
        return '-:--';
    } else if ( time == 0 ) {
        return '0:00';
    }

    return helper( Math.round( time ), 1 );
};
