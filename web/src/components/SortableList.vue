<script setup lang="ts">
    const queue = defineModel<unknown[]>();
</script>

<template>
    <div>
        <div v-for="(song, index) in queue" :key="index">
            <slot :item="song"></slot>
            <div>
                <i class="fa-solid fa-grip-vertical"></i>
            </div>
        </div>
    </div>
</template>
