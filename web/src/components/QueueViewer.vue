<script setup lang="ts">
    import AddSong from './AddSong.vue';
    import SortableList from './SortableList.vue';
    import {
        beautifyTime
    } from '@/ts/util/time';
    import player from '@/ts/player';
    import {
        ref
    } from 'vue';

    const queue = player.queue;
    const queueIndex = player.queueIdx;
    const isPlaying = player.isPlaying;
    const showAddSong = ref( false );

    const addSong = () => {
        showAddSong.value = true;
    };
</script>

<template>
    <div>
        <div>
            <button @click="addSong">
                <i class="fa-solid fa-plus"></i>
                Add
            </button>
            <button @click="player.clearQueue">
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
        <AddSong v-model="showAddSong" />
        <div>
            <SortableList v-slot="{ item: song, index }" v-model="queue">
                <div class="song-list-element">
                    <div class="song-cover-wrapper">
                        <img
                            v-if="song.artwork"
                            :src="song.artwork"
                            alt="Song cover"
                            class="song-cover"
                        >
                        <i v-else class="fa-solid fa-music song-cover"></i>
                        <div v-if="index === queueIndex" class="play-overlay">
                            <div v-if="isPlaying" class="playing-symbols">
                                <div id="bar-1" class="playing-bar"></div>
                                <div id="bar-2" class="playing-bar"></div>
                                <div id="bar-3" class="playing-bar"></div>
                            </div>
                            <i
                                v-else
                                class="fa-solid fa-pause"
                            ></i>
                        </div>
                        <div v-else class="play-overlay hover">
                            <i class="fa-solid fa-play" @click="() => player.playIndex( index )"></i>
                        </div>
                    </div>
                    <div>
                        <h3>{{ song.name }}</h3>
                        <p>{{ song.artist }}</p>
                        <p>{{ beautifyTime( song.duration ) }}</p>
                        <p>{{ song['additional-info'] }}</p>
                    </div>
                    <div>
                        <i v-if="index !== queueIndex" class="fa-solid fa-trash-can"></i>
                        <i class="fa-solid fa-pen-to-square"></i>
                    </div>
                </div>
            </SortableList>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @use '@/scss/components/queue.scss';
</style>
