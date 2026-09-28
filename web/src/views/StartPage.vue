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
    } );

    const isAuthorizedHandler = () => {
        if ( localStorage.getItem( 'close-tab' ) === 'true' ) {
            localStorage.setItem( 'reauth-ok', 'true' );
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

    const version = ( import.meta.env.VITE_GIT_REF ? ( import.meta.env.VITE_GIT_REF as string ).slice( 0, 10 ) : 'dev' ) + ( import.meta.env.PROD ? '-prod' : '-dev' );
    const gitRef = import.meta.env.VITE_GIT_REF;
</script>

<template>
    <div>
        <h1>MusicPlayer</h1>
        <button :class="['fancy-button', isLoggingIn ? 'inactive' : undefined]" @click="login">
            Log In
        </button>

        <div class="version">
            <a :href="gitRef ? 'https://github.com/janishutz/MusicPlayer/compare/' + gitRef + '...main' : 'https://github.com/janishutz/MusicPlayer'" target="_blank">
                MusicPlayer {{ version }}
            </a>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.version {
    position: fixed;
    bottom: 10px;
    right: 10px;

    >a {
        font-size: 0.8rem;
        text-decoration: none;
    }
}
</style>
