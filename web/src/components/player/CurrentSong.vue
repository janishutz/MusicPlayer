<script setup lang="ts">
    import type {
        Song
    } from '@/ts/dtype/playlist';

    const song = defineModel<Song | undefined>( {
        'required': true
    } );
    const props = defineProps<{
        'showAdditionalInfo'?: boolean
    }>();
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
            <h1>
                {{ song?.name ?? 'Not playing' }}
            </h1>
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

        h1 {
            width: 100%;
            font-size: 2.5rem;
            text-wrap: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
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
        left: 0;
    }
    100% {
        left: 100%;
    }
}
</style>
