<script setup lang="ts">
    import SortableList from '@/components/SortableList.vue';
    import {
        ref
    } from 'vue';

    const items = ref( [
        'test',
        'test2',
        'test3',
        'test4',
        'test5',
        'test6',
        'test7',
        'test8',
        'test9',
        'test10'
    ] );
</script>

<template>
    <div>
        <h1>MusicPlayer</h1>
        <div class="test">
            <SortableList v-slot="{ item, index }" v-model="items">
                {{ item }} at {{ index }}
            </SortableList>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.test {
    height: 150px;
}
</style>
