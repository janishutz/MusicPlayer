<script setup lang="ts">
    import {
        type ComputedRef,
        computed,
        onMounted
    } from 'vue';
    import {
        currentQueue,
        currentQueueIdx,
        isPlaying,
        playbackOffset,
        playbackProgress,
        playbackTime,
        startTime
    } from '@/ts/shared/state';
    import CurrentSong from '@/components/player/CurrentSong.vue';
    import ProgressBar from '@/components/player/ProgressBar.vue';
    import SharedQueue from '@/components/shared/SharedQueue.vue';
    import type {
        Song
    } from '@/ts/dtype/playlist';
    import {
        beautifyTime
    } from '@/ts/util/time';
    import shared from '@/ts/shared';

    shared.connect();

    onMounted( () => {
        setInterval( () => {
            if ( !isPlaying.value ) return;

            playbackTime.value = ( ( new Date().getTime() - startTime.value ) / 1000 ) + playbackOffset.value;
            playbackProgress.value = playbackTime.value / song.value.duration;

            if ( playbackTime.value > song.value.duration ) {
                playbackOffset.value -= song.value.duration;

                if ( currentQueueIdx.value < currentQueue.value.length - 1 )
                    currentQueueIdx.value++;
                else
                    isPlaying.value = false;
            }
        }, 250 );
    } );
    const song: ComputedRef<Song> = computed( () => {
        if ( currentQueueIdx.value >= 0 )
            return currentQueue.value[currentQueueIdx.value]!;
        else
            return {
                'artist': 'No artist',
                'duration': -1,
                'name': 'Not playing',
                'artwork': '',
                'additional-info': '',
                'identifier': 'nosong-ident',
                'source': 'local'
            };
    } );
</script>

<template>
    <div class="shared-view">
        <div class="panel">
            <div class="current-song-wrapper">
                <CurrentSong v-model="song" :show-additional-info="true" />
            </div>
            <ProgressBar v-model="playbackProgress" :disallow-move="true" />
            <div class="time">
                <p class="current">
                    {{ beautifyTime( playbackTime ) }}
                </p>
                <p class="duration">
                    {{ beautifyTime( song.duration ) }}
                </p>
            </div>
        </div>
        <div class="panel">
            <SharedQueue />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @use '@/scss/shared/main.scss';
</style>
