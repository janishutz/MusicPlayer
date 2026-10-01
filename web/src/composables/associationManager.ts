import {
    type Ref,
    ref
} from 'vue';
import {
    changesMade,
    queue
} from '@/ts/player/state';
import type {
    AssociationResult
} from '@/ts/player/plugins/interface';
import player from '@/ts/player';
import {
    updateIdentifiers
} from '@/ts/player/plugins/local/association';

export const isShowingAssociationManager = ref( false );

export const needsFiles = ref( true );

export const filesToLoad: Ref<number[]> = ref( [] );

export const isAnalyzing = ref( false );

export const associationResults: Ref<AssociationResult[]> = ref( [] );

export const associationOpts: Ref<{
    'get': ( files: FileList ) => Promise<void>,
    'mime': string;
} | null> = ref( null );

export const openAssociationManager = ( cb: ( files: FileList ) => Promise<AssociationResult[]>, mime: string, files: number[] ) => {
    isShowingAssociationManager.value = true;
    associationResults.value = [];
    needsFiles.value = true;
    isAnalyzing.value = false;
    filesToLoad.value = files;

    const callback = async ( files: FileList ): Promise<void> => {
        const results = await cb( files );

        if ( results?.length ?? -1 > 0 ) {
            associationResults.value = associationResults.value.concat( results! );
            results.map( val => {
                val.selectedIdx = 0;

                return val;
            } );
        } else {
            isShowingAssociationManager.value = false;
            player.playIndex( 0 );
        }
    };

    associationOpts.value = {
        'get': callback,
        'mime': mime
    };
};

export const saveAssociations = async () => {
    const remainingAssociations: AssociationResult[] = [];

    for ( const result of associationResults.value ) {
        let found = false;

        for ( let song of queue.value ) {
            if ( result.song.identifier === song.identifier ) {
                song = await updateIdentifiers( song, result.possibleFiles[ result.selectedIdx ?? 0 ]! );
                found = true;
                break;
            }
        }

        if ( !found )
            remainingAssociations.push( result );
    }

    associationResults.value = remainingAssociations;

    if ( associationResults.value.length === 0 ) {
        isShowingAssociationManager.value = false;
        player.playIndex( 0 );
    }

    changesMade.value = true;
};
