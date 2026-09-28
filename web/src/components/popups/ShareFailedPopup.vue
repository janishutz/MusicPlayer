<script setup lang="ts">
    import PopupElement from './PopupElement.vue';
    import {
        showShareFailedPopup
    } from '@/ts/messages';

    const dismiss = () => {
        showShareFailedPopup.value = false;
    };
</script>

<template>
    <PopupElement v-model="showShareFailedPopup">
        <h1>Share Failed!</h1>
        <p>
            For some reason, the share could not maintain a connection. To try again, re-create it.
            We are sorry for the inconvenience.
        </p>
        <button @click="dismiss">
            Dismiss
        </button>
    </PopupElement>
</template>
