import {
    type Ref,
    ref
} from 'vue';
import type {
    Song
} from '@/ts/dtype/playlist';

export interface CloudImport {
    // TODO: Consider if should make selectable and display album / playlist contents to select specific songs
    'name': string;
    'type': 'cloud';
    'search': ( term: string ) => Promise<Song[]>;
    'addSelected': ( index: number ) => void;
}

// TODO: Need to add a way to access Apple Music API everywhere (maybe configure MusicKitJS globally and consume it in its plugin later?)
export interface FileImport {
    'name': string;
    'type': 'file';
    'process': ( files: File[] ) => Promise<Song[]>;
}

export type ImportTypes = CloudImport | FileImport;

export const isShowingImportTypePicker = ref( false );

export const importers: Ref<( CloudImport | FileImport )[]> = ref( [] );

export const openImportTypePicker = ( options: ( CloudImport | FileImport )[] ) => {
    isShowingImportTypePicker.value = true;
    importers.value = options;
};
