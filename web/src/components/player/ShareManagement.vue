<script setup lang="ts">
    import messages, {
        isConnected
    } from '@/ts/messages';
    import PopupElement from '../popups/PopupElement.vue';
    import {
        ref
    } from 'vue';

    const showPopup = defineModel<boolean>( {
        'required': true
    } );
    const shareName = ref( '' );
    const useAntiTamper = ref( false );
    const errorMessage = ref( '' );

    const startShare = async () => {
        if ( !await messages.createRoom( shareName.value, useAntiTamper.value ) ) {
            errorMessage.value = 'Invalid room name';
        }
    };

    const stopShare = () => {
        messages.closeRoom();
    };
</script>

<template>
    <div>
        <PopupElement v-model="showPopup" show-close>
            <h2>Share</h2>
            <div v-if="!isConnected">
                <p>
                    You can use a share to show what you are currently listening to (and the progress) on a page.
                </p>
                <p>{{ errorMessage }}</p>
                <label for="share-name">Share Name</label>
                <input id="share-name" v-model="shareName" type="text">
                <label for="share-anti-tamper">Use Anti-Tamper</label>
                <input id="share-anti-tamper" v-model="useAntiTamper" type="checkbox">
                <button @click="startShare">
                    Create Share
                </button>
            </div>
            <div v-else>
                <!-- TODO: Need to explain and add controls -->
                <!-- TODO: How to handle anti-tamper? -->
                <p>Connected. To connect another device, enter the link below or scan the QR code.</p>
                <p>Anti-Tamper is enabled. To connect a client to be surveyed, enter the following link:</p>
                <button @click="stopShare">
                    End share
                </button>
            </div>
        </PopupElement>
    </div>
</template>
