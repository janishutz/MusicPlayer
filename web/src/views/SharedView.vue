<script setup lang="ts">
    import {
        type ComputedRef,
        computed
    } from 'vue';
    import {
        currentQueue,
        currentQueueIdx
    } from '@/ts/shared/state';
    import CurrentSong from '@/components/player/CurrentSong.vue';
    import SharedQueue from '@/components/shared/SharedQueue.vue';
    import type {
        Song
    } from '@/ts/dtype/playlist';
    import shared from '@/ts/shared';

    shared.connect();

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
            </div>
            <div>
                <SharedQueue />
            </div>
        </div>
    </div>
</template>
