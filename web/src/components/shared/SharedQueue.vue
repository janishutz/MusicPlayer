<script setup lang="ts">
    import {
        computed,
        ref
    } from 'vue';
    import {
        currentQueue,
        currentQueueIdx
    } from '@/ts/shared/state';

    const songs = computed( () => currentQueue.value?.slice( currentQueueIdx.value + 1 ) ?? [] );
    // TODO: Move this out of this file
    const showArtworks = ref( false );
    const timeToPlay = computed( () => {
        return ( idx: number ) => {
            let total = 0;

            for ( let i = 0; i < idx; i++ ) {
                total += songs.value[ i ]!.duration;
            }

            total += currentQueue.value[ currentQueueIdx.value ]?.duration ?? 0;

            return Math.round( total / 60 );
        };
    } );
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
                <p>In {{ timeToPlay( index ) }}min</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @use '@/scss/components/queue.scss';
</style>
