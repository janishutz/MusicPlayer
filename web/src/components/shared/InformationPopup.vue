<script setup lang="ts">
    import PopupElement from '../popups/PopupElement.vue';

    const show = defineModel<boolean>();
    const props = defineProps<{
        'title': string;
        'message'?: string;
    }>();

    const close = () => {
        show.value = false;
    };
</script>

<template>
    <div>
        <PopupElement v-model="show">
            <h2>{{ props.title }}</h2>
            <p>{{ props.message }}</p>
            <button @click="close">
                Ok
            </button>
        </PopupElement>
    </div>
</template>
