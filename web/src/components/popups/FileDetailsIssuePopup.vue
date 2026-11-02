<script setup lang="ts">
    import PopupElement from './PopupElement.vue';
    import {
        showMetadataRetrievalFailedPopup
    } from '@/ts/player/plugins/local/loader';

    const dismiss = () => {
        showMetadataRetrievalFailedPopup.value = false;
    };
</script>

<template>
    <PopupElement v-model="showMetadataRetrievalFailedPopup">
        <div class="file-metadata-popup">
            <h1>Song Metadata</h1>
            <p>
                We failed to retrieve metadata for at least one of the songs you loaded.
                The song was still added, but with "Unknown title" as the song title.
            </p>
            <p style="font-weight: bold;">
                You probably want to fix this manually by clicking the Edit button for the song in question.
                You can even manually search for the song on Apple Music.
            </p>
            <p style="font-size: 0.7rem;">
                That can happen due to a number of factors, such as an audio file lacking metadata or the song not being on Apple Music.
            </p>
            <button @click="dismiss">
                Ok
            </button>
        </div>
    </PopupElement>
</template>

<style lang="scss" scoped>
.file-metadata-popup {
    width: 50vw;
}
</style>
