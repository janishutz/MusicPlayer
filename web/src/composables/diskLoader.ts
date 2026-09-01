import {
    type Ref,
    ref
} from 'vue';
import type {
    FileImport
} from './importTypePicker';

export const isShowingDiskLoader = ref( false );

export const diskLoaderOpts: Ref<FileImport | null> = ref( null );

export const openDiskLoaderInterface = ( options: FileImport ) => {
    isShowingDiskLoader.value = true;
    diskLoaderOpts.value = options;
};
