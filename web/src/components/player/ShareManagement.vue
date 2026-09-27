<script setup lang="ts">
    import messages, {
        isConnected,
        room,
        useAntiTamper
    } from '@/ts/messages';
    import PopupElement from '../popups/PopupElement.vue';
    import Qrcode from 'qrcode.vue';
    import SwitchOption from '../SwitchOption.vue';
    import {
        ref
    } from 'vue';

    const showPopup = defineModel<boolean>( {
        'required': true
    } );
    const shareName = ref( '' );
    const enableAntiTamper = ref( false );
    const errorMessage = ref( '' );

    const startShare = async () => {
        if ( !await messages.createRoom( shareName.value, enableAntiTamper.value ) ) {
            errorMessage.value = 'Invalid room name';
        }
    };

    const stopShare = () => {
        messages.closeRoom();
    };

    const baseURL = ref( location.protocol + '//' + location.host + '/' );
</script>

<template>
    <PopupElement v-model="showPopup" show-close>
        <h2>Share</h2>
        <div v-if="!isConnected" class="share-wrapper">
            <p>
                You can use a share to show what you are currently listening to (and the progress) on a page.
                When you enable anit-tamper, you will have access to a special page, on which any tampering with the page will
                trigger a notification you can see on the player. Users are further informed about being surveiled.
            </p>
            <p>{{ errorMessage }}</p>
            <div
                class="create-share-view"
            >
                <label for="share-name">Share Name </label>
                <input id="share-name" v-model="shareName" type="text">
                <SwitchOption v-model="enableAntiTamper" text="Use Anti-Tamper" />
            </div>
            <button @click="startShare">
                Create Share
            </button>
        </div>
        <div v-else>
            <!-- TODO: Need to explain and add controls -->
            <!-- TODO: How to handle anti-tamper? -->
            <p>
                Connected. To connect another device, enter the link below or scan the QR code.
                <br>
                <a :href="baseURL + 'fancy/' + room" target="_blank">{{ baseURL }}share/{{ room }}</a>
            </p>
            <Qrcode :value="baseURL + 'fancy/' + room" class="qrcode" :size="200" />
            <br>
            <p v-if="useAntiTamper">
                Anti-Tamper is enabled. To connect a client to be surveyed, enter the following link:
                <a :href="baseURL + 'fancy/' + room" target="_blank">{{ baseURL }}fancy/{{ room }}</a>
            </p>
            <button @click="stopShare">
                End share
            </button>
        </div>
    </PopupElement>
</template>

<style lang="scss" scoped>
    .share-wrapper {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        width: 60vw;
    }
</style>
