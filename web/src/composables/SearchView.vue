<script setup lang="ts">
    import {
        type Ref,
        ref
    } from 'vue';
    import {
        isShowingSearchView,
        searchOpts
    } from './searchManager';
    import PopupElement from '@/components/PopupElement.vue';
    import type {
        Song
    } from '@/ts/dtype/playlist';

    const results: Ref<Song[]> = ref( [] );
    const query = ref( '' );
    const isSearching = ref( false );

    let timeout = -1;
    let searchedForQuery = '';

    const search = ( ev: KeyboardEvent ) => {
        if ( ev.key === 'Enter' ) {
            // TODO: If no new input, instead of searching, add first song
            try {
                clearTimeout( timeout );
            } catch { /* empty */ }

            doSearch();
        } else if ( query.value.length > 2 ) {
            try {
                clearTimeout( timeout );
            } catch { /* empty */ }

            timeout = setTimeout( doSearch, 250 );
        }
    };

    const doSearch = async () => {
        if ( query.value === searchedForQuery ) return;

        isSearching.value = true;
        searchedForQuery = query.value;
        results.value = await searchOpts.value?.search( query.value ) ?? [];
        isSearching.value = false;
    };

    const add = ( idx: number ) => {
        searchOpts.value?.addSelected( idx );
    };
</script>

<template>
    <div>
        <PopupElement v-model="isShowingSearchView" show-close>
            <h2>Search {{ searchOpts?.name }}</h2>
            <input
                v-model="query"
                type="text"
                placeholder="Search..."
                @keypress="search"
            >
            <div v-if="!isSearching" class="search-results-wrapper">
                <div v-for="(result, index) in results" :key="index" @click="() => add(index)">
                    <img :src="result.artwork" :alt="'Album artwork of ' + result.name + ' by ' + result.artist">
                    <h4>{{ result.name }}</h4>
                    <p>{{ result.artist }}</p>
                </div>
            </div>
            <div v-else class="search-results-wrapper">
                Searching...
            </div>
        </PopupElement>
    </div>
</template>

<style lang="scss" scoped>
    @use '@/scss/components/search.scss';
</style>
