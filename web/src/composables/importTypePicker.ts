import {
    type Ref,
    ref
} from 'vue';
import type {
    Song
} from '@/ts/dtype/playlist';

export interface CloudImport {
    'name': string;
    'type': 'cloud';
    'search': ( term: string, offset: number ) => Promise<Song[]>;
    'addSelected': ( index: number ) => void;
    'minChars'?: number;
}

export interface FileImport {
    'name': string;
    'type': 'file';
    'mime': string;
    'process': ( files: FileList, cb: ( progress: number ) => void ) => Promise<void>;
}

export type ImportTypes = CloudImport | FileImport;

export const isShowingImportTypePicker = ref( false );

export const importers: Ref<( CloudImport | FileImport )[]> = ref( [] );

export const openImportTypePicker = ( options: ( CloudImport | FileImport )[] ) => {
    isShowingImportTypePicker.value = true;
    importers.value = options;
};
