<script setup lang="ts">
    import PlayerControls from '@/components/PlayerControls.vue';
    import QueueViewer from '@/components/QueueViewer.vue';
</script>

<template>
    <div class="main-app">
        <div class="player-controls">
            <PlayerControls />
        </div>
        <div class="song-queue">
            <QueueViewer />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.main-app {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .player-controls {
        width: 60%;
    }

    .song-queue {
        width: 80%;
    }
}
</style>
