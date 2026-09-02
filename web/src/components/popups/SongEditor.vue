<script setup lang="ts">
    import PopupElement from './PopupElement.vue';

    const model = defineModel<boolean>( {
        'required': true
    } );
</script>

<template>
    <div>
        <PopupElement v-model="model" show-close>
            <h2>Edit Song</h2>
            <!-- TODO: Need a way to use the search feature to replace the song details, as of course as well text editors -->
        </PopupElement>
    </div>
</template>
