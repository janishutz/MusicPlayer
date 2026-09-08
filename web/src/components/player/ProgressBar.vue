<script setup lang="ts">
    import {
        ref,
        useTemplateRef
    } from 'vue';

    const val = defineModel<number>( {
        'required': true,
        'default': 0.5
    } );
    const moveVal = ref( 0 );
    const offset = ref( -1 );
    const isMoving = ref( false );
    const bar = useTemplateRef( 'bar' );
    const props = defineProps<{
        'disallowMove'?: boolean
    }>();

    const start = ( ev: MouseEvent ) => {
        if ( props.disallowMove ) return;

        offset.value = bar.value!.getBoundingClientRect().x;
        isMoving.value = true;
        moveVal.value = ( ev.x - offset.value ) / bar.value!.clientWidth;
        emit( 'move-start' );
    };

    const move = ( ev: MouseEvent ) => {
        if ( isMoving.value ) {
            moveVal.value = Math.max( 0, Math.min( ( ev.x - offset.value ) / bar.value!.clientWidth, 1 ) );
        }
    };

    const end = ( ev: MouseEvent ) => {
        if ( !isMoving.value ) return;

        val.value = ( ev.x - offset.value ) / bar.value!.clientWidth;
        offset.value = -1;
        isMoving.value = false;
        emit( 'move-end' );
    };

    const emit = defineEmits<{
        ( e: 'move-end' ): void;
        ( e: 'move-start' ): void;
    }>();
</script>

<template>
    <div class="progressbar">
        <div ref="bar" class="back">
            <div :style="`width: ${ isMoving ? moveVal * 100 : val * 100 }%;`"></div>
        </div>
        <div
            :class="['click-target', offset >= 0 ? 'active' : undefined, props.disallowMove ? 'disallowed' : undefined]"
            @mousedown="start"
            @mousemove="move"
            @mouseup="end"
            @mouseleave="end"
        ></div>
    </div>
</template>

<style lang="scss" scoped>
    @use '@/scss/components/progressbar.scss';
</style>
