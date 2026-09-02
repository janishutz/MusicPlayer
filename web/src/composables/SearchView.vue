<script setup lang="ts">
    import {
        isShowingSearchView,
        query,
        results,
        searchOpts
    } from './searchManager';
    import PopupElement from '@/components/popups/PopupElement.vue';
    import {
        ref
    } from 'vue';

    const isSearching = ref( false );
    const addedIndex = ref( -1 );

    let addedTimeout = -1;
    let timeout = -1;
    let searchedForQuery = '';

    const search = ( ev: KeyboardEvent ) => {
        if ( ev.key === 'Enter' ) {
            // TODO: If no new input, instead of searching, add first song
            try {
                clearTimeout( timeout );
            } catch { /* empty */ }

            doSearch();
        } else if ( query.value.length > ( searchOpts.value?.minChars ?? 0 ) - 1 ) {
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
        results.value = await searchOpts.value?.search( query.value, 0 ) ?? [];
        isSearching.value = false;
    };

    const add = ( idx: number ) => {
        try {
            clearTimeout( addedTimeout );
        } catch { /* empty */ }

        addedIndex.value = idx;
        searchOpts.value?.addSelected( idx );
        addedTimeout = setTimeout( () => {
            addedIndex.value = -1;
        }, 2000 );
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
            <div v-if="!isSearching && results.length > 0" class="search-results-wrapper">
                <div v-for="(result, index) in results" :key="index" @click="() => add(index)">
                    <img v-if="result.artwork" :src="result.artwork" :alt="'Album artwork of ' + result.name + ' by ' + result.artist">
                    <i v-else class="fa-solid fa-music img-placeholder"></i>
                    <div>
                        <h4>{{ result.name }}</h4>
                        <p>{{ result.artist }}</p>
                    </div>
                    <i v-if="addedIndex === index" class="fa-solid fa-check"></i>
                </div>
                <!-- TODO: load more if close to bottom of scroll view -->
            </div>
            <div v-else-if="!isSearching && results.length === 0" class="search-results-wrapper placeholder">
                No results found
            </div>
            <div v-else class="search-results-wrapper placeholder">
                Searching...
            </div>
        </PopupElement>
    </div>
</template>

<style lang="scss" scoped>
    @use '@/scss/components/search.scss';
</style>
