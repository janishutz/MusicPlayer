import type {
    Song
} from '@/ts/dtype/playlist';
import {
    createFileAssociationString
} from './association';
import {
    initAppleMusicApiSearch
} from '@/ts/util/search';
import {
    openDiskLoaderInterface
} from '@/composables/diskLoader';
import {
    parseBlob
} from 'music-metadata';

export const load = ( cb: ( songs: Song[] ) => void ) => {
    const search = initAppleMusicApiSearch();

    const process = async ( files: FileList, status: ( progress: number ) => void ) => {
        const songs: Song[] = [];

        for ( let i = 0; i < files.length; i++ ) {
            const file = files[i]!;

            try {
                songs.push( await generateSongObject( file ) );
            } catch ( error ) {
                console.error( '[LOADER] Failed generating song info for file', file, 'with error', error );
            }

            status( ( i + 1 ) / files.length );
        }

        cb( songs );
    };

    openDiskLoaderInterface( {
        'name': 'From Disk',
        'process': process,
        'type': 'file',
        'mime': 'audio/aac,audio/mpeg,audio/wav,audio/mp4,audio/ogg'
    } );

    const generateSongObject = async ( file: File ): Promise<Song> => {
        console.log( 'Analyzing file', file );
        const url = URL.createObjectURL( file );
        const blob = await ( await fetch( url ) ).blob();
        // Load audio file and parse its metadata
        const data = await parseBlob( blob );
        const searchTerm = data.common.title
            ? data.common.title + ( data.common.artist ? ' ' + data.common.artist : '' )
            : file.name.split( '.' )[ 0 ]!.replace( '_', ' ' );
        const result = ( await search( searchTerm, 1 ) )[ 0 ];

        if ( result ) {
            result.source = 'local';
            result['additional-identifier'] = createFileAssociationString( file );
            result.identifier = url;

            return result;
        } else {
            console.warn( '[LOADER] No results found for', searchTerm );

            return {
                'additional-identifier': file.name,
                'source': 'local',
                'identifier': url,
                'artist': data.common.artist ?? 'Unknown Artist',
                'name': data.common.title ?? 'Unknown title',
                'artwork': '',
                'additional-info': '',
                'duration': -1
            };
        }
    };
};

export const unload = async ( song: Song ) => {
    URL.revokeObjectURL( song.identifier );
};
