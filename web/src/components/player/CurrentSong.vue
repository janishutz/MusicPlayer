<script setup lang="ts">
    import {
        onMounted,
        ref,
        useTemplateRef,
        watch
    } from 'vue';
    import type {
        Song
    } from '@/ts/dtype/playlist';

    const song = defineModel<Song | undefined>( {
        'required': true
    } );
    const props = defineProps<{
        'showAdditionalInfo'?: boolean,
        'compactLayout'?: boolean
    }>();
    const titleContainer = useTemplateRef( 'title-container' );
    const title = useTemplateRef( 'title' );
    const doScroll = ref( false );
    const SCROLLBACK_DURATION = 100;
    const WAIT_DURATION = 7000;
    const MOVE_SPEED = 1.5;

    let animation: null | Animation = null;

    const updateScrollRule = () => {
        setTimeout( () => {
            doScroll.value = ( titleContainer.value?.clientWidth ?? window.innerWidth / 2 ) < ( title.value?.scrollWidth ?? 0 );

            if ( doScroll.value ) {
                const width = title.value?.scrollWidth ?? 0;
                const duration = WAIT_DURATION + SCROLLBACK_DURATION + ( width * ( 1 / MOVE_SPEED ) * 10 );
                const kf = new KeyframeEffect( title.value, [
                    {
                        'offset': 0,
                        'left': '0px'
                    },
                    {
                        'offset': WAIT_DURATION / duration,
                        'left': '0px'
                    },
                    {
                        'offset': 1 - ( SCROLLBACK_DURATION / duration ),
                        'left': `-${ width - ( titleContainer.value?.clientWidth ?? 0 ) + 100 }px`
                    },
                    {
                        'offset': 1,
                        'left': '0px'
                    }
                ], {
                    'delay': 0,
                    'direction': 'normal',
                    'duration': duration,
                    'iterations': Infinity,
                    'easing': 'cubic-bezier(0.445, 0.05, 0.55, 0.95)'
                } );

                animation = new Animation( kf, document.timeline );
                animation.play();
            } else {
                if ( animation !== null )
                    animation?.cancel();
            }
        }, 500 );
    };

    watch( song, updateScrollRule );

    onMounted( updateScrollRule );
</script>

<template>
    <div :class="['current-song', props.compactLayout ? 'compact' : undefined]">
        <div class="artwork">
            <img
                v-if="song?.artwork"
                :src="song.artwork"
                alt="Song cover"
                class="song-cover"
            >
            <img v-else class="song-cover" src="/logo.jpg">
        </div>
        <div class="song-details">
            <div ref="title-container" :class="[doScroll ? 'scroll' : undefined]">
                <h1 ref="title">
                    {{ song?.name ?? 'Not playing' }}
                </h1>
            </div>
            <p class="artist">
                {{ song?.artist ?? 'No artist' }}
            </p>
            <p v-if="props.showAdditionalInfo && song?.['additional-info']" class="additional-info">
                {{ song?.['additional-info'] }}
            </p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '@/scss/components/currentsong.scss';
</style>
