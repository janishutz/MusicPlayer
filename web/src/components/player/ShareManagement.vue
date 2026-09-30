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
                <br>
                When you enable anti-tamper, any tampering on a client with it enabled, too, will show a notification on this device.
                <a href="https://github.com/janishutz/MusicPlayer/wiki/Anti%E2%80%90Tamper" target="_blank">More information</a>
            </p>
            <p style="color: red;">
                {{ errorMessage }}
            </p>
            <i class="details">
                The share name is what is displayed at the end of the URL.
                Should ideally be short and may only contain alphanumeric characters,
                as well as hyphens and must be between 3 and 20 characters
            </i>
            <div
                class="create-share-view"
            >
                <label for="share-name">Share Name </label>
                <input id="share-name" v-model="shareName" type="text">
                <br>
                <SwitchOption v-model="enableAntiTamper" text="Use Anti-Tamper" />
            </div>
            <button @click="startShare">
                Create Share
            </button>
        </div>
        <div v-else class="share-wrapper">
            <p>
                Connected. To connect another device, enter the link below on that device or scan the QR code.
                <br>
                <a :href="baseURL + 'share/' + room" target="_blank">{{ baseURL }}share/{{ room }}</a>
            </p>
            <Qrcode :value="baseURL + 'share/' + room" class="qrcode" :size="200" />
            <i class="details">This is the link you can and should share with other people</i>
            <p>
                For a fancy-by-default view (should <i>ideally</i> only be used for a central screen), connect to
                <a :href="baseURL + 'fancy/' + room" target="_blank">{{ baseURL }}fancy/{{ room }}</a>
            </p>
            <p v-if="useAntiTamper">
                <a href="https://github.com/janishutz/MusicPlayer/wiki/Anti%E2%80%90Tamper" target="_blank">Anti-Tamper</a> is enabled.
                To connect a client to be surveyed, connect to the above URL and click "Yes"
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
        width: 50vw;

        p {
            margin-top: 5px;
            margin-bottom: 10px;
        }

        .details {
            font-size: 0.8rem;
            color: var(--theme-dimmed);
            margin-top: 5px;
            margin-bottom: 10px;
        }
    }
</style>
