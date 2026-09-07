import {
    type Ref,
    ref
} from 'vue';
import type {
    AssociationResult
} from '@/ts/player/plugins/interface';
import player from '@/ts/player';
import {
    queue
} from '@/ts/player/state';
import {
    updateIdentifiers
} from '@/ts/player/plugins/local/association';

export const isShowingAssociationManager = ref( false );

export const needsFiles = ref( true );

export const isAnalyzing = ref( false );

export const associationResults: Ref<AssociationResult[]> = ref( [] );

export const associationOpts: Ref<{
    'get': ( files: FileList ) => Promise<void>,
    'mime': string;
} | null> = ref( null );

export const openAssociationManager = ( cb: ( files: FileList ) => Promise<AssociationResult[]>, mime: string ) => {
    isShowingAssociationManager.value = true;
    associationResults.value = [];
    needsFiles.value = true;
    isAnalyzing.value = false;

    const callback = async ( files: FileList ): Promise<void> => {
        const results = await cb( files );


        if ( results?.length ?? -1 > 0 ) {
            associationResults.value = associationResults.value.concat( results! );
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

export const saveAssociations = () => {
    for ( const result of associationResults.value ) {
        for ( const song of queue.value ) {
            if ( result.song.identifier === song.identifier ) {
                updateIdentifiers( song, result.possibleFiles[ result.selectedIdx ?? 0 ]! );
                break;
            }
        }
    }

    if ( associationResults.value.length === 0 ) {
        isShowingAssociationManager.value = false;
        player.playIndex( 0 );
    }
};
