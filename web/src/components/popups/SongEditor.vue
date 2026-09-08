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
    };
</script>

<template>
    <div>
        <PopupElement v-model="model" show-close>
            <h2>Edit Song</h2>
            <button @click="search">
                Search song on Apple Music
            </button>

            <label for="song-name">Song title</label>
            <input id="song-name" v-model="localSong.name" type="text">

            <label for="song-artist">Artist</label>
            <input id="song-artist" v-model="localSong.artist" type="text">

            <label for="song-artwork">Artwork URL</label>
            <input id="song-artwork" v-model="localSong.artwork" type="text">

            <label for="song-add-info">Additional Info</label>
            <input id="song-add-info" v-model="localSong['additional-info']" type="text">

            <button @click="save">
                Save
            </button>
        </PopupElement>
    </div>
</template>
