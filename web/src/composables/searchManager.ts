import {
    type Ref,
    ref
} from 'vue';
import type {
    CloudImport
} from './importTypePicker';
import type {
    Song
} from '@/ts/dtype/playlist';

export const isShowingSearchView = ref( false );

export const searchOpts: Ref<CloudImport | null> = ref( null );

export const results: Ref<Song[]> = ref( [] );

export const query = ref( '' );

export const openSearchInterface = ( options: CloudImport ) => {
    searchOpts.value = options;
    isShowingSearchView.value = true;
    results.value = [];
    query.value = '';
};
