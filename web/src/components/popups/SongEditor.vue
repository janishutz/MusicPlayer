<script setup lang="ts">
    import {
        type Ref, ref,
        watch
    } from 'vue';
    import PopupElement from './PopupElement.vue';
    import type {
        Song
    } from '@/ts/dtype/playlist';
    import player from '@/ts/player';

    const model = defineModel<boolean>( {
        'required': true
    } );
    const props = defineProps<{
        'song': Song | null
    }>();
    const localSong: Ref<Song> = ref( {
        'name': '',
        'artist': '',
        'artwork': '',
        'additional-info': '',
        'duration': -1,
        'identifier': '',
        'source': 'local'
    } );

    watch( props, () => {
        if ( props.song )
            localSong.value = props.song;
    } );

    const search = () => {
        player.addSongFromSource( 'applemusic', ( songs: Song[] ) => {
            const song = songs[ 0 ];

            if ( !song ) return;

            localSong.value.artist = song.artist;
            localSong.value.artwork = song.artwork;
            localSong.value.name = song.name;
        }, true );
    };

    const save = () => {
        model.value = false;
        document.dispatchEvent( new CustomEvent( 'musicplayer:update' ) );
    };
</script>

<template>
    <PopupElement v-model="model" show-close>
        <h2>Edit Song</h2>
        <button @click="search">
            Search song on Apple Music
        </button>

        <table class="song-editor">
            <tbody>
                <tr>
                    <td>
                        <label for="song-name">Song title</label>
                    </td>
                    <td>
                        <input id="song-name" v-model="localSong.name" type="text">
                    </td>
                </tr>

                <tr>
                    <td>
                        <label for="song-artist">Artist</label>
                    </td>
                    <td>
                        <input id="song-artist" v-model="localSong.artist" type="text">
                    </td>
                </tr>

                <tr>
                    <td>
                        <label for="song-artwork">Artwork URL</label>
                    </td>
                    <td>
                        <input id="song-artwork" v-model="localSong.artwork" type="text">
                    </td>
                </tr>

                <tr>
                    <td>
                        <label for="song-add-info">Additional Info</label>
                    </td>
                    <td>
                        <input id="song-add-info" v-model="localSong['additional-info']" type="text">
                    </td>
                </tr>
            </tbody>
        </table>
        <button @click="save">
            Save
        </button>
    </PopupElement>
</template>

<style lang="scss" scoped>
.song-editor {
    display: flex;
    justify-content: center;
    flex-direction: column;
}
</style>
