<script setup lang="ts">
    import {
        queue,
        queueIdx
    } from '@/ts/player/state';
    import CurrentSong from '@/components/CurrentSong.vue';
    import PlayerControls from '@/components/PlayerControls.vue';
    import QueueViewer from '@/components/QueueViewer.vue';
</script>

<template>
    <div class="main-app">
        <div
            class="panel"
        >
            <div style="margin-bottom: 20px; width: 100%;">
                <CurrentSong
                    v-model="queue[queueIdx]"
                />
            </div>
            <PlayerControls />
        </div>
        <div class="panel">
            <QueueViewer />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.main-app {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;

    .panel {
        width: 45%;
        margin-left: 2.5%;
        margin-right: 2.5%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
}
</style>
