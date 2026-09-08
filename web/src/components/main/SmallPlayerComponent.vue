<script setup lang="ts">
    import {
        type ComputedRef,
        computed
    } from 'vue';
    import {
        isPlaying,
        queue,
        queueIdx
    } from '@/ts/player/state';
    import type {
        Song
    } from '@/ts/dtype/playlist';
    import {
        beautifyTime
    } from '@/ts/util/time';
    import {
        playbackPercentage
    } from '@/ts/player/status-tracking';
    import player from '@/ts/player';

    const closed = defineModel<boolean>( {
        'required': true
    } );

    const open = () => {
        closed.value = true;
    };

    const song: ComputedRef<Song> = computed( () => {
        if ( queueIdx.value >= 0 && queue.value.length > queueIdx.value ) {
            return queue.value[ queueIdx.value ]!;
        } else {
            return {
                'artwork': '',
                'additional-info': '',
                'artist': 'No artist',
                'duration': -1,
                'identifier': 'nosong-ident',
                'name': 'Not Playing',
                'source': 'local'
            };
        }
    } );
</script>

<template>
    <div :class="['small-player', closed ? 'hidden' : undefined]">
        <div>
            <img
                v-if="song.artwork"
                :src="song.artwork"
                alt="Song cover"
                class="song-cover"
            >
            <i v-else class="fa-solid fa-music song-cover" @click="open"></i>
            <div @click="open">
                <h3>{{ song.name }}</h3>
                <p>{{ song.artist }}</p>
            </div>
            <p @click="open">
                {{ beautifyTime( playbackPercentage * song.duration ) }} / {{ beautifyTime( song.duration ) }}
            </p>
            <i v-if="!isPlaying" class="fa-solid fa-play" @click="player.play"></i>
            <i v-else class="fa-solid fa-pause" @click="player.pause"></i>
            <i class="fa-solid fa-forward-step" @click="player.next"></i>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.small-player {
    background-color: var(--secondary-color);
    width: 80vw;
    height: 4.5rem;
    position: fixed;
    left: 10vw;
    bottom: 15px;
    border-radius: 2rem;
    overflow: hidden;
    transition: bottom 0.5s ease;
    transition-delay: 0.75s;
    display: flex;
    align-items: center;
    justify-content: center;

    &.hidden {
        bottom: -8vh;
        transition-delay: 0s;
    }

    >div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: calc(100% - 6rem);
        height: 100%;

        >.song-cover {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 3rem;
            height: 3rem;
            font-size: 2.5rem;
            cursor: pointer;
            margin-right: 30px;
        }

        >div {
            cursor: pointer;
            margin-right: auto;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            flex-direction: column;
            width: calc(100% - 20rem);
            overflow-x: hidden;
            height: 100%;

            >h3 {
                margin: 0;
            }

            >p {
                margin: 0;
            }
        }

        >p {
            cursor: pointer;
            margin-right: 15px;
            width: max-content;
        }

        >.fa-solid {
            font-size: 2rem;
            cursor: pointer;
        }
    }
}
</style>
