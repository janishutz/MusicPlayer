import type {
    AssociationResult
} from '../interface';
import type {
    Song
} from '@/ts/dtype/playlist';

export const createFileAssociationString = ( file: File ) => {
    return file.name + '__' + file.size;
};

export const associate = async ( files: FileList, song: Song ): Promise<AssociationResult> => {
    const candidates: File[] = [];

    if ( !song['additional-identifier'] ) {
        return {
            'match': 'none',
            'song': song,
            'possibleFiles': []
        };
    }

    for ( const file of files ) {
        if ( createFileAssociationString( file ) === song['additional-identifier'] ) {
            candidates.push( file );
        }
    }

    if ( candidates.length === 0 ) {
        return {
            'match': 'none',
            'song': song,
            'possibleFiles': []
        };
    } else if ( candidates.length === 1 ) {
        song.identifier = URL.createObjectURL( candidates[ 0 ]! );

        return {
            'match': 'exact',
            'song': song,
            'possibleFiles': []
        };
    } else {
        return {
            'match': 'multiple',
            'song': song,
            'possibleFiles': candidates
        };
    }
};

export const updateIdentifiers = async ( song: Song, file: File ): Promise<Song> => {
    song.identifier = URL.createObjectURL( file );
    song['additional-identifier'] = createFileAssociationString( file );

    return song;
};
