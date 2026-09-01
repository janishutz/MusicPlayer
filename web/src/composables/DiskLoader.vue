<script setup lang="ts">
    import PopupElement from '@/components/PopupElement.vue';
    import {
        isShowingDiskLoader
    } from './diskLoader';
</script>

<template>
    <div>
        <PopupElement v-model="isShowingDiskLoader" show-close>
            <h3>Load from disk</h3>
        </PopupElement>
    </div>
</template>
