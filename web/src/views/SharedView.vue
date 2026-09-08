<script setup lang="ts">
    import {
        type ComputedRef,
        computed,
        onMounted,
        ref
    } from 'vue';
    import {
        currentQueue,
        currentQueueIdx,
        isPlaying,
        playbackOffset,
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
    const playbackProgress = ref( 0 );

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
        <div>
            <div>
                <CurrentSong v-model="song" />
                <div class="time">
                    <p class="current">
                        {{ beautifyTime( playbackTime ) }}
                    </p>
                    <p class="duration">
                        {{ beautifyTime( song.duration ) }}
                    </p>
                </div>
                <ProgressBar v-model="playbackProgress" :disallow-move="true" />
            </div>
            <div>
                <SharedQueue />
            </div>
        </div>
    </div>
</template>
