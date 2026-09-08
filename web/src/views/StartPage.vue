<script setup lang="ts">
    import {
        onMounted,
        ref
    } from 'vue';
    import router from '@/router';
    import sdk from '@janishutz/login-sdk-browser';
    import {
        useAuthStore
    } from '@/stores/authstore';

    const isLoggingIn = ref( true );
    const store = useAuthStore();

    sdk.setUp( 'jh-music', 'http://localhost:8080', '/app' );

    onMounted( async () => {
        store.isAuth = await sdk.verify();

        if ( store.isAuth )
            router.push( '/app' );

        isLoggingIn.value = false;

        // TODO: Logout button
    } );

    const login = () => {
        if ( isLoggingIn.value ) return;

        isLoggingIn.value = true;
        sdk.login();
        isLoggingIn.value = false;
    };
</script>

<template>
    <div>
        <h1>MusicPlayer</h1>
        <button :class="['fancy-button', isLoggingIn ? 'fancy-button-inactive' : undefined]" @click="login">
            Log In
        </button>
    </div>
</template>
