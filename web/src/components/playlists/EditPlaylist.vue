<script setup lang="ts">
    import type {
        Playlist
    } from '@/ts/userPlaylists/file';
    import PopupElement from '../popups/PopupElement.vue';
    import {
        disableKeyHandler
    } from '@/ts/player/state';
    import {
        showPlaylistEdit
    } from '@/ts/player/playlists';
    import {
        watch
    } from 'vue';

    const playlist = defineModel<Playlist | undefined>( {
        'required': true
    } );

    watch( showPlaylistEdit, () => {
        disableKeyHandler.value = showPlaylistEdit.value;
    } );

    const save = () => {
        showPlaylistEdit.value = false;
    };

    const selectIcon = ( index: number ) => {
        playlist.value!.icon = icons[index] ?? '';
    };

    const icons: string[] = [
        'music',
        'filter',
        'wrench',
        'toolbox',
        'tv',
        'cake-candles',
        'martini-glass',
        'gift',
        'globe',
        'eye',
        'heart',
        'bomb',
        'camera',
        'star',
        'poo',
        'hippo',
        'pen',
        'umbrella',
        'film',
        'video',
        'image',
        'landmark',
        'moon',
        'sun',
        'desktop',
        'language',
        'headset',
        'dollar-sign',
        'chess-king',
        'face-grin-hearts',
        'feather',
        'fish',
        'floppy-disk',
        'compact-disc',
        'hard-drive'
    ];
    const emit = defineEmits<{
        ( e: 'delete-playlist' ): void;
    }>();

    const deletePlaylist = () => {
        if ( confirm( 'Do you really want to delete this playlist?' ) ) {
            emit( 'delete-playlist' );
            showPlaylistEdit.value = false;
        }
    };
</script>

<template>
    <div>
        <PopupElement v-model="showPlaylistEdit" show-close>
            <div class="edit-playlist">
                <h1>Edit Playlist</h1>
                <div class="playlist-edit-align">
                    <div class="playlist-details-wrapper">
                        <label for="playlist-title">Playlist title</label>
                        <input
                            v-if="playlist"
                            id="playlist-title"
                            v-model="playlist!.name"
                            type="text"
                            placeholder="Playlist name"
                        >
                        <p>Current icon: <i :class="['fa-solid', playlist ? 'fa-' + (playlist.icon ?? 'music') : 'fa-music']"></i></p>
                        <button style="margin-top: auto;" @click="deletePlaylist">
                            Delete Playlist
                        </button>
                    </div>
                    <div class="icon-picker-wrapper">
                        <p>Playlist icon</p>
                        <div class="icon-picker">
                            <i
                                v-for="(item, index) in icons"
                                :key="index"
                                :class="['fa-solid', 'fa-' + item]"
                                @click="() => selectIcon( index )"
                            ></i>
                        </div>
                    </div>
                </div>
                <p>Make sure to save the playlists using the "Save Changes" button if you are happy with them</p>
                <button @click="save">
                    Continue
                </button>
            </div>
        </PopupElement>
    </div>
</template>

<style lang="scss" scoped>
@use '@/scss/components/editplaylist.scss';
</style>
