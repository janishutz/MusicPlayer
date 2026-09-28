<script setup lang="ts">
    import PopupElement from './PopupElement.vue';
    import {
        ref
    } from 'vue';

    const show = defineModel<boolean>();
    const hasRechecked = ref( false );
    const emit = defineEmits<{
        ( e: 'recheck' ): void;
    }>();

    const recheck = () => {
        hasRechecked.value = false;
        emit( 'recheck' );
        setTimeout( () => {
            hasRechecked.value = true;
        }, 1000 );
    };

    const openStore = () => {
        window.open( 'https://store.janishutz.com/product/com.janishutz.MusicPlayer' );
    };
</script>

<template>
    <PopupElement v-model="show">
        <div class="unowned-container">
            <h1>No Access</h1>
            <p>
                You are currently not subscribed to MusicPlayer. You therefore cannot use it.
                Click the button below to subscribe to MusicPlayer, then hit "recheck" below when done.
            </p>
            <i v-if="hasRechecked">Still unowned</i>
            <div>
                <button @click="openStore">
                    To Store
                </button>
                <button @click="recheck">
                    Recheck
                </button>
            </div>
        </div>
    </PopupElement>
</template>

<style lang="scss" scoped>
.unowned-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 90vw;

    @media screen and (min-aspect-ratio: 1) {
        width: 50vw;
    }
}
</style>
