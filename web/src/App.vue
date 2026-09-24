<script setup lang="ts">
    import {
        Notifications
    } from '@kyvg/vue3-notification';
    import {
        RouterView
    } from 'vue-router';
    import {
        selectedTheme
    } from './ts/util/theme';

    const changeTheme = () => {};
</script>

<template>
    <div>
        <notifications
            position="top center"
            :duration="5000"
            class="notifications"
            style="top: 20px;"
            width="400px"
            :max="3"
        />
        <button id="themeSelector" title="Toggle between light and dark mode" @click="changeTheme();">
            {{ selectedTheme }}
        </button>
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
@include gen-theme('.theme-black', $theme-black);
@include gen-theme('.theme-white', $theme-black);
</style>
