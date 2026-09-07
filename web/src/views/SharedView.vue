<script setup lang="ts">
    import CurrentSong from '@/components/player/CurrentSong.vue';
    import SharedQueue from '@/components/shared/SharedQueue.vue';
    import shared from '@/ts/shared';

    shared.connect();
</script>

<template>
    <div class="shared-view">
        <div>
            <div>
                <CurrentSong />
            </div>
            <div>
                <SharedQueue :songs="[]" :idx="-1" />
            </div>
        </div>
    </div>
</template>
