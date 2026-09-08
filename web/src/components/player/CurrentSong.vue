<script setup lang="ts">
    import type {
        Song
    } from '@/ts/dtype/playlist';

    const song = defineModel<Song>( {
        'required': false
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
            <i v-else class="fa-solid fa-music song-cover"></i>
        </div>
        <div class="song-details">
            <h1>
                {{ song?.name ?? 'Not playing' }}
            </h1>
            <p>{{ song?.artist ?? 'No artist' }}</p>
            <p v-if="props.showAdditionalInfo">
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
        }
    }

    .song-details {
        >* {
            margin: 10px;
        }
    }
}
</style>
