<script setup lang="ts">
    import {
        onMounted,
        ref
    } from 'vue';
    import router from '@/router';
    import * as sdk from '@janishutz/oidc-login-sdk-browser';
    import {
        useAuthStore
    } from '@/stores/authstore';

    const isLoggingIn = ref( true );
    const store = useAuthStore();

    sdk.configure( {} );

    onMounted( async () => {
        try {
            store.isAuth = await sdk.verify();

            if ( store.isAuth )
                isAuthorizedHandler();
        } catch ( e ) {
            if ( e !== 'ERR_401' ) {
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
