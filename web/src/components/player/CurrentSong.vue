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
        'showAdditionalInfo'?: boolean
    }>();
    const titleContainer = useTemplateRef( 'title-container' );
    const title = useTemplateRef( 'title' );
    const doScroll = ref( false );
    const SCROLLBACK_DURATION = 500;
    const WAIT_DURATION = 5000;
    const MOVE_SPEED = 2;

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
        }, 1000 );
    };

    watch( song, updateScrollRule );

    onMounted( updateScrollRule );
</script>

<template>
    <div class="current-song">
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
.current-song {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .artwork {
        width: 100%;
        height: 100%;
        max-height: calc(100% - 9rem);

        >img, .fa-solid {
            height: 100%;
            font-size: 40vh;
            border-radius: 10px;
        }
    }

    .song-details {
        width: 100%;
        overflow-x: hidden;

        >* {
            margin: 10px;
        }

        >div {
            height: 4rem;
            h1 {
                font-size: 2.5rem;
                text-wrap: nowrap;
                margin: 0;
            }

            &.scroll {
                width: 100%;
                position: relative;

                h1 {
                    position: absolute;
                    left: 0;
                    // animation: cubic-bezier(0.445, 0.05, 0.55, 0.95);
                    // animation: slide ease 20s infinite;
                }
            }
        }

        .artist {
            font-size: 1.5rem;
            margin-bottom: 0px;
        }

        .additional-info {
            font-size: 1.25rem;
            font-weight: bold;
            margin-top: 0px;
        }
    }
}

@keyframes slide {
    0% {
        transform: translateX(0);
    }
    40% {
        transform: translateX(0);
    }
    95% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(0);
    }
}
</style>
