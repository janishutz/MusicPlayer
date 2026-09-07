<script setup lang="ts">
    import {
        computed,
        ref
    } from 'vue';
    import type {
        Song
    } from '@/ts/dtype/playlist';

    const props = defineProps<{
        'songs': Song[],
        'idx': number
    }>();
    const songs = computed( () => props.songs?.slice( props.idx + 1 ) ?? [] );
    // TODO: Move this out of this file
    const showArtworks = ref( false );
</script>

<template>
    <div class="queue-container">
        <div v-for="(song, index) in songs" :key="index" class="song-list-element">
            <div class="song-cover-wrapper">
                <img
                    v-if="song.artwork && showArtworks"
                    :src="song.artwork"
                    alt="Song cover"
                    class="song-cover"
                >
                <i v-else class="fa-solid fa-music song-cover"></i>
            </div>
            <div class="song-details">
                <h3>{{ song.name }}</h3>
                <p>{{ song.artist }}</p>
                <p>{{ song['additional-info'] }}</p>
            </div>
            <div class="song-actions">
                <p>In {{ song.duration }}min</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @use '@/scss/components/queue.scss';
</style>
