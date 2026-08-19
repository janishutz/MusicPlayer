<template>
    <div>
        <div :class="'popup-backdrop' + ( isOpen ? '' : ' hidden' )">
            <div class="popup-main">
                <span v-if="props.showClose" class="material-symbols-outlined close-icon" @click="closePopup()">close</span>
                <slot></slot>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
    const isOpen = defineModel<boolean>();
    const props = defineProps<{
        'showClose'?: boolean
    }>();

    const closePopup = () => {
        isOpen.value = false;
    };
</script>


<style scoped>
    .popup-backdrop {
        width: 100vw;
        height: 100vh;
        position: fixed;
        background-color: var( --overlay-color );
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        transition: all 0.5s;
        transform: scale(1);
        z-index: 99;
    }

    .hidden {
        transform: scale(0);
    }

    .popup-main {
        width: 40%;
        height: 50%;
        background-color: var( --secondary-color );
        padding: 2.5%;
        border-radius: 20px;
        position: relative;
        overflow-y: scroll;
        display: block;
    }

    .close-icon {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 2rem;
        cursor: pointer;
        user-select: none;
    }
</style>
