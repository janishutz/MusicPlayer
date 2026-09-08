<script setup lang="ts">
    import PopupElement from '../popups/PopupElement.vue';

    const show = defineModel<boolean>();

    const close = () => {
        show.value = false;
    };
</script>

<template>
    <div>
        <!-- TODO: Beacon request when exiting browser (and confirm popup for that!) -->
        <PopupElement v-model="show">
            <h2>Settings</h2>
            <button @click="close">
                Ok
            </button>
        </PopupElement>
    </div>
</template>
