<script setup lang="ts">
    import {
        showTamperNotification,
        tamperingClientName,
        tamperingKind
    } from '@/ts/messages/anti-tamper';
    import PopupElement from './PopupElement.vue';

    const tamperingMap: {
        [key: string]: string
    } = {
        'visibility': 'leaving the browser window',
        'blur': 'leaving the browser window',
        'disconnect': 'disconnection from the WebSocket (this could also have happened due to network conditions)',
        'settings': 'Client settings were opened'
    };

    const dismiss = () => {
        showTamperNotification.value = false;
    };
</script>

<template>
    <PopupElement v-model="showTamperNotification">
        <h1>Display is being tampered with</h1>
        <p>Client "{{ tamperingClientName ? tamperingClientName : '(no name set or known)' }}" is currently being tampered with.</p>
        <p>The kind of tampering reported is "{{ tamperingMap[tamperingKind] ?? `unknown (raw: "${tamperingKind}")` }}"</p>
        <button @click="dismiss">
            Dismiss
        </button>
    </PopupElement>
</template>
