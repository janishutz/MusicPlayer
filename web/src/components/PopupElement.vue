<template>
    <div :class="['popup', isOpen ? undefined : 'hidden' ]">
        <div class="popup-backdrop"></div>
        <div class="popup-main">
            <i v-if="props.showClose" class="fa-solid fa-xmark close-icon" @click="closePopup()"></i>
            <slot></slot>
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


<style scoped lang="scss">
    .popup {
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        transition-delay: 0;
        overflow: hidden;

        .popup-backdrop {
            width: 100vw;
            height: 100vh;
            position: absolute;
            background-color: var( --overlay-color );
            top: 0;
            left: 0;
            overflow: hidden;
            transition: all 0.25s;
        }

        .popup-main {
            width: fit-content;
            height: fit-content;
            background-color: var( --secondary-color );
            padding: 2.5%;
            border-radius: 20px;
            transform: scale(1);
            position: relative;
            overflow: hidden;
            display: block;
            transition: transform 0.25s ease, opacity 0.25s ease;

            >.close-icon {
                position: absolute;
                top: 20px;
                right: 20px;
                font-size: 1.5rem;
                cursor: pointer;
                user-select: none;
            }
        }

        &.hidden {
            top: -100vh;
            transition-delay: 0.25s;

            .popup-main {
                transform: scale(1.25);
                opacity: 0;
                transition: transform 0.15s ease, opacity 0.15s ease;
            }

            .popup-backdrop {
                opacity: 0;
            }
        }
    }
</style>
