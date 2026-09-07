<script setup lang="ts">
    import PlayerWrapper from '@/components/main/PlayerWrapper.vue';
    import PlaylistsComponent from '@/components/main/PlaylistsComponent.vue';
    import {
        ref
    } from 'vue';
    import request from '@/ts/request';
    import router from '@/router';

    const checkingStatus = ref( true );

    const ownershipCheck = async () => {
        const data = await ( await request.get( '/user/owned' ) ).json();

        if ( data[ 'status' ] )
            router.push( '/get' );
    };

    ownershipCheck();
</script>

<template>
    <div class="main-app">
        <div v-if="checkingStatus">
            Loading...
        </div>
        <div v-else>
            <PlaylistsComponent />
            <PlayerWrapper />
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
}
</style>
