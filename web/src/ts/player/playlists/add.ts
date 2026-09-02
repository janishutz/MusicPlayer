import {
    currentSource,
    isPlaying,
    queue,
    queueIdx,
    rawQueue,
    repeat,
    shuffle,
    sources
} from '../state';
import {
    duration,
    playbackPercentage
} from '../status-tracking';
import type {
    Song
} from '@/ts/dtype/playlist';

export const addSongList = ( songs: Song[] ) => {
    rawQueue.value = rawQueue.value.concat( songs );
    queue.value = queue.value.concat( songs );
};

export const clearQueue = () => {
    queue.value = [];
    rawQueue.value = [];
    sources[currentSource.value]?.stop();
    duration.value = -1;
    playbackPercentage.value = 1;
    isPlaying.value = false;
    repeat.value = 'off';
    shuffle.value = false;

    for ( const song of queue.value ) {
        sources[ song.source ]?.songUnload( song );
    }
};

/**
 * Remove a song from the given queue index
 * @param idx - The index to remove at
 * @returns True if successful, False if not
 */
export const removeSong = ( idx: number ) => {
    if ( idx <= queueIdx.value ) return false;

    const removed = queue.value.splice( idx, 1 )[0];

    for ( let i = 0; i < rawQueue.value.length; i++ ) {
        if ( rawQueue.value[ i ] === removed ) {
            rawQueue.value.splice( i, 1 );
        }
    }

    return true;
};

/**
 * Move a song in the queue
 * @param idx - The index to move
 * @param newIdx - The index to move it to
 * @returns True if successful, false if constraints were violated
 */
export const moveSong = ( idx: number, newIdx: number ) => {
    if ( idx === newIdx ) return true;

    if ( idx <= queueIdx.value || newIdx <= queueIdx.value || idx > queue.value.length || newIdx > queue.value.length )
        return false;

    // Affects only the queue if shuffled, else copy the queue into rawQueue
    const movedEl = queue.value[ idx ]!;

    if ( idx < newIdx )
        for ( let i = idx + 1; i < Math.min( queue.value.length, newIdx + 1 ); i++ ) {
            queue.value[ i - 1 ] = queue.value[ i ]!;
        }
    else if ( idx > newIdx )
        for ( let i = idx + 1; i > Math.max( 0, newIdx + 1 ); i-- ) {
            queue.value[ i ] = queue.value[ i - 1 ]!;
        }

    queue.value[ newIdx ] = movedEl;

    if ( !shuffle.value ) {
        // If we don't shuffle, the rawQueue should also be updated
        rawQueue.value = [];

        for ( const song of queue.value ) {
            rawQueue.value.push( song );
        }
    }

    return true;
};

/** Shuffle the song list */
export const shuffleList = () => {
    const shuffled = rawQueue.value
        .map( ( val, idx ) => {
            return {
                val,
                idx,
                'sort': Math.random()
            };
        } ).sort( ( a, b ) => a.sort - b.sort );
    const q: Song[] = [];

    // Make current song the first in the list
    q.push( rawQueue.value[queueIdx.value]! );

    for ( const el of shuffled ) {
        if ( el.idx !== queueIdx.value )
            q.push( el.val );
    }

    queue.value = q;
};
