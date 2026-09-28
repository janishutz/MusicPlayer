<script setup lang="ts">
    import LogoutPopup from '@/components/popups/LogoutPopup.vue';
    import PlayerWrapper from '@/components/main/PlayerWrapper.vue';
    import PlaylistsComponent from '@/components/main/PlaylistsComponent.vue';
    import {
        ref
    } from 'vue';

    const showLogoutPopup = ref( false );
    const logout = () => showLogoutPopup.value = true;
</script>

<template>
    <div class="main-app">
        <i class="fa-solid fa-right-from-bracket" @click="logout()"></i>
        <LogoutPopup v-model="showLogoutPopup" />
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

    >.fa-right-from-bracket {
        position: fixed;
        top: 10px;
        right: 10px;
        font-size: 1.25rem;
        cursor: pointer;
    }
}
</style>
