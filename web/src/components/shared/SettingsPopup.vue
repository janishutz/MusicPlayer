<script setup lang="ts">
    import PopupElement from '../popups/PopupElement.vue';

    const show = defineModel<boolean>();

    // TODO: Tampering notification for opening settings

    const close = () => {
        show.value = false;
    };
</script>

<template>
    <div>
        <PopupElement v-model="show">
            <h2>Settings</h2>
            <button @click="close">
                Ok
            </button>
        </PopupElement>
    </div>
</template>
