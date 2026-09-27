<script setup lang="ts">
    import PopupElement from '../popups/PopupElement.vue';

    const show = defineModel<boolean>();
    const props = defineProps<{
        'title': string;
        'msg'?: string;
    }>();

    const close = () => {
        show.value = false;
    };
</script>

<template>
    <PopupElement v-model="show">
        <div class="info-popup">
            <h2>{{ props.title }}</h2>
            <p>{{ props.msg }}</p>
            <button @click="close">
                Ok
            </button>
        </div>
    </PopupElement>
</template>

<style lang="scss" scoped>
.info-popup {
    max-width: 60vw;
}
</style>
