<script setup lang="ts">
    import {
        allowAntiTamper,
        backgroundAnimation,
        backgroundAnimationTypes,
        clientName,
        enableFancyBackground,
        hideBranding,
        isAntiTamperActive,
        isAntiTamperAvailable,
        showArtworks
    } from '@/ts/shared/state';
    import PopupElement from '../popups/PopupElement.vue';
    import SwitchOption from '../SwitchOption.vue';
    import antiTamper from '@/ts/shared/anti-tamper';
    import {
        watch
    } from 'vue';

    const show = defineModel<boolean>();

    watch( show, () => {
        if ( show.value && isAntiTamperActive.value ) {
            antiTamper.sendMessage( 'settings', 'You are not allowed to change any settings' );
        }
    } );

    const close = () => {
        show.value = false;
    };
</script>

<template>
    <div>
        <PopupElement v-model="show" :show-close="true">
            <h2>Settings</h2>
            <table class="settings-opts">
                <tbody>
                    <tr v-if="isAntiTamperAvailable">
                        <td>Enable Anit-Tamper?</td>
                        <td>
                            <SwitchOption v-model="allowAntiTamper" text="" />
                        </td>
                    </tr>
                    <tr v-if="isAntiTamperActive">
                        <td>
                            <label for="client-name">Anti-Tamper Client Name</label>
                        </td>
                        <td>
                            <input id="client-name" v-model="clientName" type="text">
                        </td>
                    </tr>
                    <tr>
                        <td>Enable Fancy Background (uses more resources)</td>
                        <td>
                            <SwitchOption v-model="enableFancyBackground" text="" />
                        </td>
                    </tr>
                    <tr v-if="enableFancyBackground">
                        <td>Select the background animation</td>
                        <td>
                            <select v-model="backgroundAnimation">
                                <option v-for="(item, index) in backgroundAnimationTypes" :key="index" :value="item">
                                    {{ item.slice( 0, 1 ).toLocaleUpperCase() + item.substring(1) }}
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Show Artwork for upcoming songs (uses more bandwidth)</td>
                        <td>
                            <SwitchOption v-model="showArtworks" text="" />
                        </td>
                    </tr>
                    <tr>
                        <td>Hide branding (left or bottom) :(</td>
                        <td>
                            <SwitchOption v-model="hideBranding" text="" />
                        </td>
                    </tr>
                </tbody>
            </table>
            <button @click="close">
                Close
            </button>
        </PopupElement>
    </div>
</template>

<style lang="scss" scoped>
.settings-opts {
    text-align: start;
}
</style>
