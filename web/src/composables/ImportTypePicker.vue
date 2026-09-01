<script setup lang="ts">
    import {
        type ImportTypes,
        importers,
        isShowingImportTypePicker
    } from './importTypePicker';
    import PopupElement from '@/components/PopupElement.vue';
    import SearchView from './SearchView.vue';
    import {
        openDiskLoaderInterface
    } from './diskLoader';
    import {
        openSearchInterface
    } from './searchManager';

    const openPicker = ( source: ImportTypes ) => {
        isShowingImportTypePicker.value = false;


        if ( source.type === 'cloud' ) {
            openSearchInterface( source );
        } else {
            openDiskLoaderInterface( source );
        }
    };
</script>

<template>
    <div>
        <SearchView />
        <PopupElement v-model="isShowingImportTypePicker">
            <h3>What would you like to add?</h3>
            <div class="import-type-list">
                <div v-for="(source, index) in importers" :key="index" @click="openPicker( source )">
                    {{ source.name }}
                </div>
            </div>
        </PopupElement>
    </div>
</template>
