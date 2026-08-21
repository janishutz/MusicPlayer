<template>
    <div class="not-found-view">
        <h1>404</h1>
        <p>Page not found</p>
        <RouterLink to="/" class="button primary">
            Home
        </RouterLink>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
    .not-found-view {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
</style>
