<script setup lang="ts">
    import {
        beautifyTime
    } from '@/ts/util/time';
    import player from '@/ts/player';

    const queue = player.queue;
    const idx = player.queueIdx;
    const isPlaying = player.isPlaying;

</script>

<template>
    <div>
        <div>
            <button>
                <i class="fa-solid fa-plus"></i>
                Add
            </button>
            <button>
                <i class="fa-solid fa-xmark"></i>
                Clear
            </button>
            <button>
                <i class="fa-solid fa-save"></i>
                Save
            </button>
            <!-- TODO: Should only appear when sharing -->
            <button>
                <i class="fa-solid fa-paper-plane"></i>
                Transmit
            </button>
        </div>
        <div>
            <div v-for="(song, index) in queue" :key="index">
                <div class="song-cover-wrapper">
                    <img
                        v-if="song.cover"
                        :src="song.cover"
                        alt="Song cover"
                        class="song-cover"
                    >
                    <i v-else class="fa-solid fa-music song-cover"></i>
                    <div v-if="isPlaying && index === idx" class="playing-symbols">
                        <div id="bar-1" class="playing-bar"></div>
                        <div id="bar-2" class="playing-bar"></div>
                        <div id="bar-3" class="playing-bar"></div>
                    </div>
                    <i v-else class="fa-solid fa-play play-pause" @click="() => player.playIndex( index )"></i>
                    <i class="fa-solid fa-pause play-pause" @click="player.pause"></i>
                </div>
                <div>
                    <h3>{{ song.name }}</h3>
                    <p>{{ song.artist }}</p>
                    <p>{{ beautifyTime( song.duration ) }}</p>
                    <p>{{ song['additional-info'] }}</p>
                </div>
                <div>
                    <i class="fa-solid fa-trash-can"></i>
                    <i class="fa-solid fa-pen-to-square"></i>
                    <i class="fa-solid fa-grip-vertical"></i>
                </div>
            </div>
        </div>
    </div>
</template>
