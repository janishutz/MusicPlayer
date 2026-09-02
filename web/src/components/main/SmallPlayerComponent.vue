<script setup lang="ts">
    const closed = defineModel<boolean>( {
        'required': true
    } );

    const open = () => {
        closed.value = true;
    };
</script>

<template>
    <div :class="['small-player', closed ? 'hidden' : undefined]" @click="open">
        Player
    </div>
</template>

<style lang="scss" scoped>
.small-player {
    background-color: green;
    width: 80vw;
    height: 7vh;
    position: fixed;
    left: 10vw;
    bottom: 15px;
    border-radius: 4vh;
    overflow: hidden;
    transition: bottom 0.5s ease;
    transition-delay: 0.75s;

    &.hidden {
        bottom: -8vh;
        transition-delay: 0s;
    }
}
</style>
