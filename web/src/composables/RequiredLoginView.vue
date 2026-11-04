<script setup lang="ts">
    import {
        isShowingRequiredLoginView,
        logIntoRequiredService,
        requiredLoginsList
    } from './requiredLogin';
    import PopupElement from '@/components/popups/PopupElement.vue';
    import {
        fullPlayer
    } from '@/ts/player/state';
    import player from '@/ts/player';

    const cancel = () => {
        player.clearQueue();
        isShowingRequiredLoginView.value = false;
        fullPlayer.value = false;
    };
</script>

<template>
    <PopupElement v-model="isShowingRequiredLoginView">
        <div class="title">
            <h2>Login required</h2>
            <p>You need to log into the following services to play this playlist</p>
        </div>
        <div class="song-sources">
            <div v-for="(source, index) in requiredLoginsList" :key="index" @click="() => logIntoRequiredService( source.id )">
                <div>
                    <i v-if="source.icon" :class="['fa-solid', 'fa-' + source.icon]"></i>
                    <p>{{ source.name }}</p>
                </div>
            </div>
        </div>
        <div>
            <button @click="cancel">
                Cancel
            </button>
        </div>
    </PopupElement>
</template>

<style lang="scss" scoped>
@use '@/scss/components/addsong.scss';
</style>
