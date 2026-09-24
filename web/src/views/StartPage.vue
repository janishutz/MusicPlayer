<script setup lang="ts">
    import * as sdk from '@janishutz/oidc-login-sdk-browser';
    import {
        onMounted,
        ref
    } from 'vue';
    import router from '@/router';
    import {
        useAuthStore
    } from '@/stores/authstore';

    const isLoggingIn = ref( true );
    const store = useAuthStore();

    onMounted( async () => {
        try {
            store.isAuth = await sdk.auth.check();

            if ( store.isAuth )
                isAuthorizedHandler();
        } catch ( e ) {
            if ( e instanceof sdk.request.AuthError ) {
                throw e;
            }
        }

        isLoggingIn.value = false;

        // TODO: Logout button
    } );

    const isAuthorizedHandler = () => {
        if ( localStorage.getItem( 'close-tab' ) === 'true' ) {
            localStorage.setItem( 'login-ok', 'true' );
            localStorage.removeItem( 'close-tab' );

            return window.close();
        }

        router.push( '/app' );
    };

    const login = () => {
        if ( isLoggingIn.value ) return;

        isLoggingIn.value = true;
        sdk.auth.login();
        isLoggingIn.value = false;
    };
</script>

<template>
    <div>
        <h1>MusicPlayer</h1>
        <button :class="['fancy-button', isLoggingIn ? 'inactive' : undefined]" @click="login">
            Log In
        </button>
    </div>
</template>
