<script setup lang="ts">
    import PopupElement from '../popups/PopupElement.vue';
    import shared from '@/ts/shared';
    import {
        showShareNotFoundPopup
    } from '@/ts/shared/state';

    const close = () => {
        showShareNotFoundPopup.value = false;
    };

    let retryLock = false;

    const retry = () => {
        if ( retryLock ) return;

        retryLock = true;
        showShareNotFoundPopup.value = false;
        setTimeout( async () => {
            await shared.connect();
            retryLock = false;
        }, 1000 );
    };
</script>

<template>
    <PopupElement v-model="showShareNotFoundPopup">
        <div class="info-popup">
            <h2>Share not found</h2>
            <p>The share you have specified does not currently exist. Please try again later</p>
            <div>
                <button @click="close">
                    Ok
                </button>
                <button @click="retry">
                    Retry
                </button>
            </div>
        </div>
    </PopupElement>
</template>

<style lang="scss" scoped>
.info-popup {
    max-width: 50vw;
}
</style>
