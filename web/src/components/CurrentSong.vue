<script setup lang="ts">
    import type {
        Song
    } from '@/ts/dtype/playlist';

    const song = defineModel<Song>( {
        'required': false
    } );
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
        </div>
    </div>
</template>

<style lang="scss" scoped>
.current-song {
    width: 100%;

    .artwork {
        width: 100%;

        >img, .fa-solid {
            width: 60%;
            max-height: 50%;
            font-size: 15vw;
        }
    }

    .song-details {
        >* {
            margin: 10px;
        }
    }
}
</style>
