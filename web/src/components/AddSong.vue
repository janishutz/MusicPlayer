<script setup lang="ts">
    import ImportTypePicker from '@/composables/ImportTypePicker.vue';
    import PopupElement from '@/components/PopupElement.vue';
    import player from '@/ts/player';
    import {
        sources
    } from '@/ts/player/state';

    const showPopup = defineModel<boolean>( {
        'required': true
    } );

    const addSong = ( source: string ) => {
        player.addSongFromSource( source );
        showPopup.value = false;
    };
</script>

<template>
    <div>
        <ImportTypePicker />
        <PopupElement v-model="showPopup" show-close>
            <h1>Add Song</h1>
            <div class="song-sources">
                <div v-for="(source, index) in sources" :key="index" @click="() => addSong( source.id )">
                    <i v-if="source.icon" :class="['fa-solid', 'fa-' + source.icon]"></i>
                    <p>{{ source.name }}</p>
                </div>
            </div>
        </PopupElement>
    </div>
</template>

<style lang="scss" scoped>
.song-sources {
    display: flex;
    flex-wrap: wrap;
    width: 50vw;
    height: 35vh;
    justify-content: center;
    overflow-y: scroll;
    overflow-x: hidden;

    >div {
        width: 32%;
        margin: 0.5%;
        height: 50%;
        background-color: var(--accent-background);
        border-radius: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        >.fa-solid {
            font-size: 1.5rem;
        }
    }
}
</style>
