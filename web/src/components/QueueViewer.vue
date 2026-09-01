<script setup lang="ts">
    import {
        type Ref,
        type WritableComputedRef,
        computed,
        ref
    } from 'vue';
    import AddSong from './AddSong.vue';
    import type {
        Song
    } from '@/ts/dtype/playlist';
    import SongEditor from './SongEditor.vue';
    import SortableList from './SortableList.vue';
    import {
        beautifyTime
    } from '@/ts/util/time';
    import player from '@/ts/player';

    const queue: WritableComputedRef<Song[]> = computed( {
        get () {
            return player.queue.value.slice( player.queueIdx.value );
        },
        set ( val ) {
            player.queue.value = player.queue.value.slice( 0, player.queueIdx.value ).concat( val );
        }
    } );
    const isPlaying = player.isPlaying;
    const showAddSong = ref( false );
    const showEditSong = ref( false );
    const editingSong: Ref<null | Song> = ref( null );

    const addSong = () => {
        showAddSong.value = true;
    };

    const editSong = ( idx: number ) => {
        showEditSong.value = true;
        editingSong.value = player.queue.value[ idx ]!;
    };

    const deleteSong = ( idx: number ) => {
        player.removeSong( idx );
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
        <SongEditor v-model="showEditSong" editing-song="" />
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
                        <div v-if="index === 0" class="play-overlay">
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
                    <div class="song-details">
                        <h3>{{ song.name }}</h3>
                        <p>{{ song.artist }}</p>
                        <p>{{ song['additional-info'] }}</p>
                    </div>
                    <div class="song-actions">
                        <p>{{ beautifyTime( song.duration ) }}</p>
                        <i v-if="index !== 0" class="fa-solid fa-trash-can" @click="() => deleteSong( index )"></i>
                        <i class="fa-solid fa-pen-to-square" @click="() => editSong( index )"></i>
                    </div>
                </div>
            </SortableList>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @use '@/scss/components/queue.scss';
</style>
