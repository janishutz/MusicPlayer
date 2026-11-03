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
import {
    ref
} from 'vue';

export const showMetadataRetrievalFailedPopup = ref( false );

export const load = ( cb: ( songs: Song[] ) => void ) => {
    const search = initAppleMusicApiSearch();

    const process = async ( files: FileList, status: ( progress: number ) => void ) => {
        const songs: Song[] = [];

        let failedCount = 0;

        for ( let i = 0; i < files.length; i++ ) {
            const file = files[i]!;

            try {
                const [
                    song,
                    success
                ] = await generateSongObject( file );

                songs.push( song );

                if ( !success )
                    failedCount += 1;
            } catch ( error ) {
                failedCount += 1;
                console.error( '[LOADER] Failed generating song info for file', file, 'with error', error );
            }

            status( ( i + 1 ) / files.length );
        }

        if ( failedCount > 0 ) {
            showMetadataRetrievalFailedPopup.value = true;
        }

        cb( songs );
    };

    openDiskLoaderInterface( {
        'name': 'From Disk',
        'process': process,
        'type': 'file',
        'mime': 'audio/aac,audio/mpeg,audio/wav,audio/mp4,audio/ogg,audio/flac,audio/m4a',
        'autoClose': false
    } );

    const generateSongObject = async ( file: File ): Promise<[Song, boolean]> => {
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
            result.duration = Math.round( data.format.duration ?? result.duration );
            result.identifier = url;

            return [
                result,
                true
            ];
        } else {
            console.warn( '[LOADER] No results found for', searchTerm );

            return [
                {
                    'additional-identifier': createFileAssociationString( file ),
                    'source': 'local',
                    'identifier': url,
                    'artist': data.common.artist ?? 'Unknown Artist',
                    'name': data.common.title ?? 'Unknown title',
                    'artwork': '',
                    'additional-info': '',
                    'duration': Math.round( data.format.duration ?? -1 )
                },
                false
            ];
        }
    };
};

export const unload = async ( song: Song ) => {
    URL.revokeObjectURL( song.identifier );
};
