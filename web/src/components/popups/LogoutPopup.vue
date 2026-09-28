<script setup lang="ts">
    import PopupElement from './PopupElement.vue';
    import {
        logout
    } from '@janishutz/oidc-login-sdk-browser/auth';
    import messages from '@/ts/messages';

    const show = defineModel<boolean>( {
        'required': true
    } );

    const logOut = async () => {
        await messages.closeRoom();
        logout();
    };

    const cancel = () => show.value = false;
</script>

<template>
    <PopupElement v-model="show" :show-close="true">
        <h2>Log out</h2>
        <p>Do you really want to log out? This will close any currently open room</p>
        <button @click="logOut">
            Log Out
        </button>
        <button @click="cancel">
            Cancel
        </button>
    </PopupElement>
</template>
