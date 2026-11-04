import {
    fullPlayer,
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
import {
    openRequiredLoginManager
} from '@/composables/requiredLogin';
import {
    playIndex
} from '.';

export const load = ( playlist: PlaylistSongs ) => {
    queue.value = playlist;
    rawQueue.value = playlist;

    const filesToLoadLocaly: number[] = [];
    const servicesToLogInto: string[] = [];

    for ( let i = 0; i < playlist.length; i++ ) {
        if ( playlist[i]!['additional-identifier'] ) {
            filesToLoadLocaly.push( i );
        } else if ( playlist[i]!.source !== 'local' ) {
            const src = playlist[i]!.source;

            if ( !servicesToLogInto.includes( src ) ) {
                servicesToLogInto.push( src );
            }
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

    if ( filesToLoadLocaly.length > 0 || servicesToLogInto.length > 0 ) {
        openRequiredLoginManager( servicesToLogInto );

        if ( filesToLoadLocaly.length > 0 ) {
            const mime = Object.values( sources )
                .map( src => {
                    return src.loading.requiresLocalFiles === true ? src.loading.mime : '';
                } )
                .reduce( ( prev, curr ) => {
                    return prev === '' ? curr : prev + ',' + curr;
                } );

            openAssociationManager( fileLoader, mime, filesToLoadLocaly );
        }
    } else {
        playIndex( 0 );
    }

    fullPlayer.value = true;
};
