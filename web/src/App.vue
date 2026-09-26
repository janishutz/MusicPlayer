<script setup lang="ts">
    import {
        darkMode,
        selectedTheme,
        themes
    } from './ts/util/theme';
    import {
        Notifications
    } from '@kyvg/vue3-notification';
    import {
        RouterView
    } from 'vue-router';
    import {
        ref
    } from 'vue';

    const changeTheme = () => {
        showThemePanel.value = !showThemePanel.value;
    };

    const showThemePanel = ref( false );
</script>

<template>
    <div id="main">
        <notifications
            position="top center"
            :duration="5000"
            class="notifications"
            style="top: 20px;"
            width="400px"
            :max="3"
        />
        <i
            id="theme-selector"
            class="fa-solid fa-moon"
            title="Toggle between light and dark mode"
            @click="changeTheme();"
        >
        </i>
        <div
            id="theme-selection-panel"
            :class="showThemePanel ? 'shown' : undefined"
        >
            <h3>Themes</h3>
            <select v-model="selectedTheme">
                <option v-for="(val, index) in themes" :key="index" :value="val">
                    {{ val }}
                </option>
            </select>
            <label for="light-mode-toggle">Dark Mode</label>
            <input id="light-mode-toggle" v-model="darkMode" type="checkbox">
        </div>
        <router-view v-slot="{ Component, route }">
            <transition :name="route.meta.transition ? String( route.meta.transition ) : 'fade'" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>
    </div>
</template>

<style lang="scss">
@include gen-theme('.theme-red-dark', $theme-red-dark);
@include gen-theme('.theme-red-light', $theme-red-light);
@include gen-theme('.theme-blue-dark', $theme-blue-dark);
@include gen-theme('.theme-blue-light', $theme-blue-light);
@include gen-theme('.theme-purple-dark', $theme-purple-dark);
@include gen-theme('.theme-purple-light', $theme-purple-light);
@include gen-theme('.theme-black-light', $theme-black-light);
@include gen-theme('.theme-black-dark', $theme-black-dark);
@include gen-theme('.theme-white-light', $theme-white-light);
@include gen-theme('.theme-white-dark', $theme-white-dark);

#main {
    width: 100%;
}

#theme-selector {
    position: fixed;
    top: 10px;
    left: 10px;
    font-size: 1rem;
    z-index: 1000;
    cursor: pointer;
}

// TODO: Switches
#theme-selection-panel {
    position: fixed;
    z-index: 1000;
    top: calc(5px + 3rem);
    left: -220px;
    width: 200px;
    height: 250px;
    background-color: var(--theme-primary);
    color: var(--theme-on-primary);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
    border-radius: 20px;
    transition: left 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);

    &.shown {
        left: 5px;
    }
}
</style>
