<script setup lang="ts">
    import {
        diskLoaderOpts,
        isShowingDiskLoader
    } from './diskLoader';
    import {
        onMounted,
        ref,
        useTemplateRef
    } from 'vue';
    import PopupElement from '@/components/popups/PopupElement.vue';

    const fileinput = useTemplateRef( 'fileinput' );
    const progress = ref( -1 );

    onMounted( () => {
        fileinput.value?.addEventListener( 'change', async () => {
            if ( fileinput.value && fileinput.value.files ) {
                progress.value = 0;
                await diskLoaderOpts.value?.process( fileinput.value.files, ( curr: number ) => {
                    progress.value = curr;
                } );
                isShowingDiskLoader.value = false;
                setTimeout( () => {
                    progress.value = -1;
                }, 1000 );
            }
        } );
    } );
</script>

<template>
    <div>
        <PopupElement v-model="isShowingDiskLoader" show-close>
            <h2>Load from disk</h2>
            <input
                ref="fileinput"
                type="file"
                multiple
                :accept="diskLoaderOpts?.mime ?? '*'"
            >
            <div v-if="progress >= 0">
                <p style="margin-bottom: 0;">
                    Analyzing, please wait
                </p>
                <progress :value="progress" max="1"></progress>
            </div>
        </PopupElement>
    </div>
</template>
