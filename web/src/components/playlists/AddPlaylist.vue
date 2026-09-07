<script setup lang="ts">
    import PopupElement from '../popups/PopupElement.vue';
    import {
        ref
    } from 'vue';

    const showPopup = defineModel<boolean>( {
        'required': true
    } );

    const addPlaylist = () => {
        showPopup.value = false;
        emit( 'add-playlist', playlistName.value );
    };

    const playlistName = ref( '' );
    const emit = defineEmits<{
        ( e: 'add-playlist', name: string ): void;
    }>();
</script>

<template>
    <div>
        <PopupElement v-model="showPopup" show-close>
            <div class="title">
                <h1>Add Playlist</h1>
            </div>
            <input v-model="playlistName" type="text" placeholder="Playlist name">
            <br>
            <button @click="addPlaylist">
                <i class="fa-solid fa-plus"></i>
                Add Playlist
            </button>
        </PopupElement>
    </div>
</template>

<style lang="scss" scoped>
.title {
    >h1 {
        margin-bottom: 5px;
    }
    >p {
        margin: 0;
        margin-bottom: 10px;
    }
}
.song-sources {
    display: flex;
    flex-wrap: wrap;
    width: 50vw;
    height: 40vh;
    justify-content: center;
    overflow-y: scroll;
    overflow-x: hidden;

    >div {
        width: 45%;
        margin: 0.5%;
        height: 60%;
        background-color: var(--accent-background);
        border-radius: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        flex-direction: column;

        >div {
            display: flex;
            justify-content: center;
            align-items: center;

            >.fa-solid {
                font-size: 1.5rem;
            }
        }

        >.not-auth-notice {
            font-size: 0.6rem;
            margin: 0;
            width: 70%;
        }
    }
}
</style>
