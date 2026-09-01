import {
    type Ref,
    ref
} from 'vue';
import type {
    CloudImport
} from './importTypePicker';

export const isShowingSearchView = ref( false );

export const searchOpts: Ref<CloudImport | null> = ref( null );

export const openSearchInterface = ( options: CloudImport ) => {
    searchOpts.value = options;
    isShowingSearchView.value = true;
};
