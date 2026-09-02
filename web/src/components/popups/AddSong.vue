<script setup lang="ts">
    import DiskLoader from '@/composables/DiskLoader.vue';
    import ImportTypePicker from '@/composables/ImportTypePicker.vue';
    import PopupElement from './PopupElement.vue';
    import player from '@/ts/player';
    import {
        sources
    } from '@/ts/player/state';

    const showPopup = defineModel<boolean>( {
        'required': true
    } );

    const addSong = async ( source: string ) => {
        if ( await player.addSongFromSource( source ) ) {
            showPopup.value = false;
        }
    };
</script>

<template>
    <div>
        <ImportTypePicker />
        <DiskLoader />
        <PopupElement v-model="showPopup" show-close>
            <div class="title">
                <h1>Add Song(s)</h1>
                <p>Pick the source of your songs</p>
            </div>
            <div class="song-sources">
                <div v-for="(source, index) in sources" :key="index" @click="() => addSong( source.id )">
                    <div>
                        <i v-if="source.icon" :class="['fa-solid', 'fa-' + source.icon]"></i>
                        <p>{{ source.name }}</p>
                    </div>
                    <p v-if="!source.authorized.value" class="not-auth-notice">
                        You have not yet logged into this source. Clicking this will start login
                    </p>
                </div>
            </div>
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
