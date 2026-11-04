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
@use '@/scss/components/addsong.scss';
</style>
