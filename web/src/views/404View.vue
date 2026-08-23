<template>
    <div class="not-found-view">
        <h1>404</h1>
        <p>Page not found</p>
        <RouterLink to="/" class="fancy-button">
            Home
        </RouterLink>
    </div>
</template>

<style scoped lang="scss">
    .not-found-view {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        h1 {
            font-size: 20vh;
            line-height: 100%;
            margin: 10px;
        }
    }
</style>
