<script setup lang="ts">
    import {
        addPlaylist,
        removePlaylist,
        selectPlaylist
    } from '@/ts/userPlaylists';
    import {
        getPlaylists,
        savePlaylists
    } from '@/ts/userPlaylists/save';
    import {
        onMounted,
        ref
    } from 'vue';
    import {
        playlistIdx,
        playlists
    } from '@/ts/userPlaylists/state';
    import AddPlaylist from './AddPlaylist.vue';
    import EditPlaylist from './EditPlaylist.vue';
    import router from '@/router';

    const checkingStatus = ref( true );
    const dots = ref( 0 );
    const showAddPlaylist = ref( false );
    const editingPlaylist = ref( -1 );

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
            if ( e === 'ERR_402' ) {
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

    const openEditPlaylistPopup = ( index: number ) => {
        editingPlaylist.value = index;
    };

    const deletePlaylist = () => {
        removePlaylist( editingPlaylist.value );
        editingPlaylist.value = -1;
    };
</script>

<template>
    <div class="playlists">
        <AddPlaylist v-model="showAddPlaylist" @add-playlist="addPlaylist" />
        <EditPlaylist v-model="playlists[editingPlaylist]" @delete-playlist="deletePlaylist" />
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
                    <div class="playlist-icon" @click="() => selectPlaylist( index )">
                        <i v-if="index === playlistIdx" class="fa-solid fa-circle-play"></i>
                        <i v-else :class="['fa-solid', playlist.icon ? 'fa-' + playlist.icon : 'fa-music']"></i>
                    </div>
                    <div class="playlist-details">
                        <h2 @click="() => selectPlaylist( index )">
                            {{ playlist.name }}
                        </h2>
                        <i
                            class="fa-solid fa-sliders"
                            title="Edit the playlist or delete it"
                            @click="() => openEditPlaylistPopup( index )"
                        ></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @use '@/scss/components/playlists.scss';
</style>
