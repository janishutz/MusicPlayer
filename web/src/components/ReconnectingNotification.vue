<script setup lang="ts">
    import {
        showIsReconnecting
    } from '@/composables/requiredLogin';

</script>

<template>
    <div :class="['reconnecting', showIsReconnecting ? 'shown' : undefined]">
        Reconnecting
    </div>
</template>

<style lang="scss" scoped>
    @use "@/scss/components/reconnecting.scss";
</style>
