import type {
    Song
} from '@/ts/dtype/playlist';

export interface CloudImport {
    // TODO: Consider if should make selectable and display album / playlist contents to select specific songs
    'name': string;
    'kind': 'list' | 'nested-list';
    'search': ( term: string ) => Promise<Song[]>;
    'addSelected': ( index: number ) => Promise<Song[]>;
}

// TODO: Need to add a way to access Apple Music API everywhere (maybe configure MusicKitJS globally and consume it in its plugin later?)
export interface FileImport {
    'name': string;
    'process': ( files: File[] ) => Promise<Song[]>;
}
