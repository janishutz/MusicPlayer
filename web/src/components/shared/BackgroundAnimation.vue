<script setup lang="ts">
    const props = defineProps<{
        'image'?: string
    }>();
</script>

<template>
    <div class="background-animation">
        <img :src="props.image ? props.image : '/logo.jpg'">
    </div>
</template>

<style lang="scss" scoped>
    @use '@/scss/shared/background.scss';
</style>
