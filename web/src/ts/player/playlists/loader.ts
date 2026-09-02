import {
    queue,
    rawQueue,
    sources
} from '../state';
import type {
    AssociationResult
} from '../plugins/interface';
import type {
    PlaylistSongs
} from '@/ts/dtype/playlist';
import {
    openAssociationManager
} from '@/composables/associationManager';

export const load = ( playlist: PlaylistSongs ) => {
    queue.value = playlist;
    rawQueue.value = playlist;

    let needToLoadLocalSongs = false;

    for ( const song of playlist ) {
        if ( song['additional-identifier'] ) {
            needToLoadLocalSongs = true;
            break;
        }
    }

    const fileLoader = async ( files: FileList ) => {
        const associationResults: AssociationResult[] = [];

        for ( const song of playlist ) {
            const source = sources[song.source]!;

            if ( source.loading.requiresLocalFiles === true ) {
                associationResults.push( await source.loading.association( files as FileList, song ) );
            }
        }

        return associationResults.filter( val => val.match !== 'exact' );
    };

    if ( needToLoadLocalSongs ) {
        // FIXME: Combine mime types
        openAssociationManager( fileLoader, '' );
    }
};
