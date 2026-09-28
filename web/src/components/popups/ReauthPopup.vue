<script setup lang="ts">
    import PopupElement from './PopupElement.vue';
    import {
        auth
    } from '@janishutz/oidc-login-sdk-browser';
    import {
        showReauthPopup
    } from '@/ts/util/reauth';

    const reauth = () => {
        auth.loginInNewTab();
        showReauthPopup.value = false;
    };
</script>

<template>
    <PopupElement v-model="showReauthPopup">
        <h1>Logged out</h1>
        <p>
            For some reason, you have been logged out.
            To keep your player alive and reconnect the share, click the button below to re-authenticate.
            If you wish to end your session, simply close the browser tab or reload it.
            <br>
            We are sorry for the inconvenience
        </p>
        <button @click="reauth">
            Re-Authenticate
        </button>
    </PopupElement>
</template>
