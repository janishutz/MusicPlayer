<script setup lang="ts">
    import PlayerComponent from './PlayerComponent.vue';
    import SmallPlayerComponent from './SmallPlayerComponent.vue';
    import {
        ref
    } from 'vue';

    const fullPlayer = ref( true );

    const close = () => {
        fullPlayer.value = false;
    };
</script>

<template>
    <div class="player-wrapper">
        <SmallPlayerComponent v-model="fullPlayer" />
        <div :class="['player-container', fullPlayer ? undefined : 'hidden']">
            <i class="fa-solid fa-xmark" @click="close"></i>
            <PlayerComponent />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .player-container {
        width: 100vw;
        height: 100vh;
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: var(--secondary-color);
        transition: bottom 1s ease;
        transition-delay: 0.25s;

        &.hidden {
            transition-delay: 0s;
            bottom: -100vh;
        }

        >.fa-xmark {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 1.5rem;
            cursor: pointer;
        }
    }
</style>
