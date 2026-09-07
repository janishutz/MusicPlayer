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
                <input v-model="shareName" type="text">
                <button @click="startShare">
                    Create Share
                </button>
            </div>
            <div v-else>
                <!-- TODO: Need to explain and add controls -->
                <!-- TODO: How to handle anti-tamper? -->
                <p>Connected</p>
                <button @click="stopShare">
                    End share
                </button>
            </div>
        </PopupElement>
    </div>
</template>
