<script setup lang="ts">
    import {
        allowAntiTamper,
        clientName,
        isAntiTamperAvailable,
        isAntiTamperPossiblePage
    } from '@/ts/shared/state';
    import {
        ref,
        watch
    } from 'vue';
    import PopupElement from '../popups/PopupElement.vue';

    let hasDismissed = sessionStorage.getItem( 'anti-tamper-allowed' ) !== null;

    const show = ref( isAntiTamperPossiblePage && isAntiTamperAvailable.value && !hasDismissed );

    watch( isAntiTamperAvailable, () => {
        show.value = isAntiTamperPossiblePage && isAntiTamperAvailable.value && !hasDismissed;
    } );

    const close = () => {
        hasDismissed = true;
        show.value = false;
        allowAntiTamper.value = false;
    };

    const enable = () => {
        if ( clientName.value.length < 2 ) alert( 'Name is too short' );

        hasDismissed = true;
        show.value = false;
        allowAntiTamper.value = true;
    };
</script>

<template>
    <PopupElement v-model="show">
        <div class="anti-tamper-popup">
            <h2>Enable Anti-Tamper?</h2>
            <p>
                Anti-Tamper is available for this share. Enabling it will send a notification to the host
                whenever you leave this page or tamper with it in any other way.
                Do you want to enable it? If so, please also enter a name below
            </p>
            <input v-model="clientName" type="text">
            <div>
                <button @click="enable">
                    Yes
                </button>
                <button @click="close">
                    No
                </button>
            </div>
        </div>
    </PopupElement>
</template>

<style lang="scss" scoped>
.anti-tamper-popup {
    max-width: 50vw;

    >div {
        margin-top: 10px;
        >input {
            color: var(--theme-on-app);
        }
    }
}
</style>
