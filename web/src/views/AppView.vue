<script setup lang="ts">
    import PlayerWrapper from '@/components/main/PlayerWrapper.vue';
    import PlaylistsComponent from '@/components/main/PlaylistsComponent.vue';

</script>

<template>
    <div class="main-app">
        <PlaylistsComponent />
        <PlayerWrapper />
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
}
</style>
