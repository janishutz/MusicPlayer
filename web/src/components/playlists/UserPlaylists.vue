<script setup lang="ts">
    import {
        addPlaylist,
        removePlaylist,
        selectPlaylist
    } from '@/ts/userPlaylists';
    import {
        editingPlaylists,
        playlists
    } from '@/ts/userPlaylists/state';
    import {
        getPlaylists,
        savePlaylists
    } from '@/ts/userPlaylists/save';
    import {
        onMounted,
        ref
    } from 'vue';
    import AddPlaylist from './AddPlaylist.vue';
    import {
        UnownedError
    } from '@/ts/request';
    import router from '@/router';

    const checkingStatus = ref( true );
    const dots = ref( 0 );
    const showAddPlaylist = ref( false );

    let interval = -1;

    const loadPlaylists = async () => {
        if ( interval < 0 ) {
            interval = setInterval( () => {
                dots.value = ( dots.value + 1 ) % 4;
            }, 500 );
        }

        try {
            await getPlaylists();
        } catch ( e ) {
            if ( e instanceof UnownedError ) {
                router.push( '/get' );
            }
        }

        checkingStatus.value = false;

        try {
            clearInterval( interval );
            interval = -1;
        } catch { /* Empty */ }
    };

    onMounted( () => {
        loadPlaylists();
    } );

    onMounted( () => {} );

    const openAddPlaylistPopup = () => {
        showAddPlaylist.value = true;
    };

    const togglePlaylistEditing = ( idx: number ) => {
        editingPlaylists.value[ idx ] = !editingPlaylists.value[ idx ];
    };
</script>

<template>
    <div class="playlists">
        <AddPlaylist v-model="showAddPlaylist" @add-playlist="addPlaylist" />
        <div v-if="checkingStatus" class="playlist-wrapper">
            Loading{{ '.'.repeat( dots ) }}
        </div>
        <div v-else-if="playlists.length === 0" class="playlist-wrapper">
            No playlists
            <button @click="openAddPlaylistPopup">
                <i class="fa-solid fa-plus"></i>
                Add one
            </button>
        </div>
        <div v-else class="playlist-wrapper">
            <div class="playlist-actions">
                <button @click="openAddPlaylistPopup">
                    <i class="fa-solid fa-plus"></i>
                    Add Playlist
                </button>
                <button @click="savePlaylists">
                    <i class="fa-solid fa-floppy-disk"></i>
                    Save Changes
                </button>
                <button @click="loadPlaylists">
                    <i class="fa-solid fa-rotate"></i>
                    Undo unsaved changes
                </button>
            </div>
            <div class="playlist-container">
                <div v-for="(playlist, index) in playlists" :key="index" class="playlist">
                    <i class="fa-solid fa-circle-play" @click="() => selectPlaylist( index )"></i>
                    <input v-if="editingPlaylists[ index ]" v-model="playlist.name" type="text">
                    <h2 v-else @click="() => selectPlaylist( index )">
                        {{ playlist.name }}
                    </h2>
                    <i class="fa-solid fa-pen-to-square" @click="() => togglePlaylistEditing( index )"></i>
                    <i class="fa-solid fa-trash" @click="() => removePlaylist( index )"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @use '@/scss/components/playlists.scss';
</style>
