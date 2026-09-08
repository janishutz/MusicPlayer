<script setup lang="ts">
    import {
        currentQueue,
        currentQueueIdx,
        playbackTime,
        showArtworks
    } from '@/ts/shared/state';
    import {
        computed
    } from 'vue';

    const songs = computed( () => currentQueue.value?.slice( currentQueueIdx.value + 1 ) ?? [] );
    const timeToPlay = computed( () => {
        return ( idx: number ) => {
            let total = 0;

            for ( let i = 0; i < idx; i++ ) {
                total += songs.value[ i ]!.duration;
            }

            total += currentQueue.value[ currentQueueIdx.value ]?.duration ?? 0;
            total -= playbackTime.value;

            return Math.round( total / 60 );
        };
    } );
</script>

<template>
    <div class="queue-viewer">
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
    </div>
</template>

<style lang="scss" scoped>
    @use '@/scss/components/queue.scss';
</style>
