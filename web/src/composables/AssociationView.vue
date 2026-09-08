<script setup lang="ts">
    import {
        associationOpts,
        associationResults,
        isAnalyzing,
        isShowingAssociationManager,
        needsFiles,
        saveAssociations
    } from './associationManager';
    import {
        fullPlayer,
        queue
    } from '@/ts/player/state';
    import {
        onMounted,
        useTemplateRef
    } from 'vue';
    import PopupElement from '@/components/popups/PopupElement.vue';
    import player from '@/ts/player';

    const fileinput = useTemplateRef( 'fileinput' );

    onMounted( () => {
        fileinput.value?.addEventListener( 'change', async () => {
            if ( fileinput.value && fileinput.value.files ) {
                await associationOpts.value?.get( fileinput.value.files );
            }
        } );
    } );

    const deleteSong = ( idx: number ) => {
        const id = associationResults.value[ idx ]!.song.identifier;

        for ( let i = 0; i < queue.value.length; i++ ) {
            const song = queue.value[ i ]!;

            if ( song.identifier === id ) {
                player.removeSong( i );

                return;
            }
        }

        associationResults.value.splice( idx, 1 );
    };

    const cancel = () => {
        player.clearQueue();
        isShowingAssociationManager.value = false;
        fullPlayer.value = false;
    };

    const retry = () => {
        associationResults.value = [];
        isAnalyzing.value = false;
        needsFiles.value = true;
    };
</script>

<template>
    <div>
        <PopupElement v-model="isShowingAssociationManager">
            <h2>Load from disk</h2>
            <div v-if="needsFiles">
                <p>Some songs in this playlist require local files.</p>
                <!-- TODO: probably need to list songs here somehow -->
                <input
                    ref="fileinput"
                    type="file"
                    multiple
                    :accept="associationOpts?.mime ?? '*'"
                >
            </div>
            <div v-if="needsFiles && !isAnalyzing && associationResults.length > 0" class="association-wrapper">
                <button @click="saveAssociations">
                    Save
                </button>
                <div v-for="(result, index) in associationResults" :key="index" class="association">
                    <p>
                        <b>{{ result.song.name.length > 30 ? result.song.name.slice( 0, 30 ) + '...' : result.song.name }}</b>
                        by
                        <i>{{ result.song.artist.length > 20 ? result.song.artist.slice( 0, 20 ) + '...' : result.song.artist }}</i>
                    </p>
                    <select v-if="result.match === 'multiple'">
                        <option v-for="(file, idx) in result.possibleFiles" :key="idx" :value="idx">
                            {{ file.name }}
                        </option>
                    </select>
                    <div v-else-if="result.match === 'none'">
                        <p>
                            No match
                        </p>
                        <i class="fa-solid fa-trash" @click="() => deleteSong( index )"></i>
                    </div>
                </div>
            </div>
            <div v-else-if="associationResults.length === 0"></div>
            <div v-else>
                An error occurred. Please try again
                <button @click="retry">
                    Retry
                </button>
            </div>
            <button @click="cancel">
                Cancel
            </button>
        </PopupElement>
    </div>
</template>

<style lang="scss" scoped>
.association-wrapper {
    width: 60vw;
    height: 50vh;
    overflow-x: hidden;
    overflow-y: scroll;

    .association {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 3rem;

        >div, select {
            display: flex;
            margin-left: auto;
            justify-content: center;
            align-items: center;
            >p {
                margin-right: 10px;
            }
        }
    }
}
</style>
