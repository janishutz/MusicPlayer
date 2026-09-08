<script setup lang="ts">
    import UserPlaylists from '../playlists/UserPlaylists.vue';

</script>

<template>
    <div class="playlist-main">
        <h1>Playlists</h1>
        <UserPlaylists />
    </div>
</template>

<style lang="scss" scoped>
.playlist-main {
    height: 100%;
    width: 100%;
}
</style>
