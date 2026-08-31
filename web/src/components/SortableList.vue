<script setup lang="ts" generic="T">
    import {
        computed,
        ref,
        useTemplateRef
    } from 'vue';

    const queue = defineModel<T[]>( {
        'required': true
    } );

    defineSlots<{
        default( props: {
            'item': T,
            'index': number
        } ): void
    }>();

    const emit = defineEmits<{
        ( e: 'dropped' ): void
    }>();
    const scrollContainer = useTemplateRef( 'scroll-container' );
    const movingIdx = ref( -1 );
    const movingCurrentIdx = ref( -1 );
    const movableSize = ref( -1 );
    const offset = ref( -1 );

    let mover = -1;
    let moveSpeed = 0;

    const start = ( ev: MouseEvent, idx: number ) => {
        movableSize.value = document.getElementById( 'movable-' + idx )!.scrollHeight;
        offset.value = ev.y - ( movableSize.value / 2 );
        movingIdx.value = idx;
        movingCurrentIdx.value = idx;
    };

    const move = ( ev: MouseEvent ) => {
        if ( movingIdx.value < 0 ) return;

        offset.value = ev.y - ( movableSize.value / 2 );
        const relToContainer = ev.y - scrollContainer.value!.offsetTop;
        const height = scrollContainer.value!.offsetHeight;

        // Scrolling up and down
        if ( relToContainer < 50 ) {
            if ( relToContainer < 0 )
                moveSpeed = -20;
            else
                moveSpeed = -Math.ceil( Math.max( 1, Math.min( 5 / relToContainer, 10 ) ) );

            startTracker();
        } else if ( relToContainer > height - 50 ) {
            if ( height - relToContainer < 0 )
                moveSpeed = 20;
            else
                moveSpeed = Math.ceil( Math.max( 1, Math.min( 5 / ( height - relToContainer ), 10 ) ) );

            startTracker();
        } else {
            if ( mover >= 0 ) {
                try {
                    clearInterval( mover );
                    mover = -1;
                } catch { /* empty */ }
            }
        }

        // Determine current index to insert
        const percentage = ( relToContainer + scrollContainer.value!.scrollTop ) / scrollContainer.value!.scrollHeight;
        const newIdx = Math.min( Math.max( Math.round( percentage * queue.value.length ), 0 ), queue.value.length - 1 );

        if ( newIdx !== movingIdx.value )
            movingCurrentIdx.value = newIdx;
        else
            movingCurrentIdx.value = movingIdx.value;
    };

    const startTracker = () => {
        if ( mover < 0 ) {
            mover = setInterval( () => {
                scrollContainer.value!.scrollTop += moveSpeed;
            }, 100 );
        }
    };

    const end = () => {
        offset.value = -1;
        movingIdx.value = -1;

        // TODO: Actually do the move
        try {
            clearInterval( mover );
            mover = -1;
        } catch { /* empty */ }

        emit( 'dropped' );
    };

    const style = computed( () => {
        return ( index: number ) => {
            if ( movingIdx.value === queue.value.length - 1 && movingIdx.value === index + 1
                && movingCurrentIdx.value === movingIdx.value )
                return `margin-bottom: ${ movableSize.value }px;`;

            if ( movingIdx.value >= 0 ) {
                if ( movingIdx.value === index ) {
                    // Current item is moved
                    return `top: ${ offset.value }px;`;
                } else {
                    // Current item is not moved
                    if ( movingCurrentIdx.value === queue.value.length - 1 && index === movingCurrentIdx.value ) {
                        // Create gap below
                        return `margin-bottom: ${ movableSize.value }px;`;
                    } else if ( movingCurrentIdx.value === index
                        || ( movingCurrentIdx.value === index - 1 && movingIdx.value == index - 1 ) ) {
                        // Create a gap above
                        return `margin-top: ${ movableSize.value }px;`;
                    }
                }
            }

            return '';
        };
    } );
</script>

<template>
    <div ref="scroll-container" class="sortable-list">
        <div
            v-if="movingIdx >= 0"
            class="grip-target"
            @mousemove="move"
            @mouseleave="end"
            @mouseup="end"
        >
        </div>
        <div
            v-for="(item, index) in queue"
            :id="'movable-' + index"
            :key="index"
            :class="[ 'movable', movingIdx === index ? 'moving' : undefined ]"
            :style="style(index)"
        >
            <slot :item="item" :index="index"></slot>
            <i class="fa-solid fa-grip-vertical" @mousedown="( e ) => start( e, index )"></i>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import '@/scss/components/sortablelist.scss'
</style>
