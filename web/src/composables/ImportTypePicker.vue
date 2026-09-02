<script setup lang="ts">
    import {
        type ImportTypes,
        importers,
        isShowingImportTypePicker
    } from './importTypePicker';
    import PopupElement from '@/components/popups/PopupElement.vue';
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
        <PopupElement v-model="isShowingImportTypePicker" show-close>
            <h2>What would you like to add?</h2>
            <div class="import-type-list">
                <div v-for="(source, index) in importers" :key="index" @click="openPicker( source )">
                    {{ source.name }}
                </div>
            </div>
        </PopupElement>
    </div>
</template>

<style lang="scss" scoped>
.import-type-list {
    display: flex;
    flex-wrap: wrap;
    width: 50vw;
    height: 35vh;
    justify-content: center;
    overflow-y: scroll;
    overflow-x: hidden;

    >div {
        width: 32%;
        margin: 0.5%;
        height: 50%;
        background-color: var(--accent-background);
        border-radius: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        >.fa-solid {
            font-size: 1.5rem;
        }
    }
}
</style>
