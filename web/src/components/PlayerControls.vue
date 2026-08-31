<script setup lang="ts">
    import ProgressBar from './ProgressBar.vue';
    import {
        beautifyTime
    } from '@/ts/util/time';
    import player from '@/ts/player';

    const playbackPercentage = player.playbackPercentage;
    const duration = player.duration;
    const repeatMode = player.repeat;
    const shuffleMode = player.shuffle;

    const seek = () => {
        player.seekTo( playbackPercentage.value );
    };

    const toggleRepeatMode = () => {
        switch ( repeatMode.value ) {
            case 'one':
                player.setRepeat( 'all' );
                break;
            case 'off':
                player.setRepeat( 'one' );
                break;
            case 'all':
                player.setRepeat( 'off' );
        }
    };

    const openShareMenu = () => {
        alert( 'Share menu not yet implemented' );
    };

    // TODO: Button availability
</script>

<template>
    <div class="mp-player">
        <div class="controls">
            <i class="fa-solid fa-backward-step" @click="player.prev"></i>
            <i class="fa-solid fa-arrow-rotate-left quick-seek" @click="player.back10"></i>
            <div :class="['play-pause', 'paused']">
                <i class="fa-solid fa-play" @click="player.play"></i>
                <i class="fa-solid fa-pause" @click="player.pause"></i>
            </div>
            <i class="fa-solid fa-arrow-rotate-right quick-seek" @click="player.skip10"></i>
            <i class="fa-solid fa-forward-step" @click="player.next"></i>
        </div>

        <div class="time">
            <!-- TODO: Probably needs to be a computed -->
            <p class="current">
                {{ beautifyTime( playbackPercentage * duration ) }}
            </p>
            <p class="duration">
                {{ beautifyTime( duration ) }}
            </p>
        </div>
        <ProgressBar v-model="playbackPercentage" @move-end="seek" />
        <div class="bottom-bar">
            <!-- FA being a POS means need to make own mods to it -->
            <i
                :class="[
                    'fa-solid',
                    'fa-repeat',
                    'repeat',
                    repeatMode === 'one' ? 'once' : undefined,
                    repeatMode === 'all' ? 'all' : undefined
                ]"
                @click="toggleRepeatMode"
            ></i>
            <i class="fa-solid fa-share-from-square" @click="openShareMenu"></i>
            <i
                :class="['fa-solid', 'fa-shuffle', shuffleMode ? 'active' : undefined]"
                @click="player.setShuffle( !shuffleMode )"
            ></i>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import '@/scss/components/player.scss';
</style>
