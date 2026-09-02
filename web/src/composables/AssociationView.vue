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
        onMounted,
        useTemplateRef
    } from 'vue';
    import PopupElement from '@/components/popups/PopupElement.vue';
    import player from '@/ts/player';
    import {
        queue
    } from '@/ts/player/state';

    const fileinput = useTemplateRef( 'fileinput' );

    onMounted( () => {
        fileinput.value?.addEventListener( 'change', async () => {
            if ( fileinput.value && fileinput.value.files ) {
                associationResults.value.concat( await associationOpts.value?.get( fileinput.value.files ) ?? [] );
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
            <div v-else-if="!needsFiles && !isAnalyzing && associationResults.length === 0">
                All files have been associated correctly
            </div>
            <div v-else-if="!needsFiles && !isAnalyzing && associationResults.length > 0">
                <button @click="saveAssociations">
                    Save
                </button>
                <div v-for="(result, index) in associationResults" :key="index">
                    <p>
                        {{ result.song.name }} by {{ result.song.artist }}
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
            <div v-else>
                An error occurred. Please try again
                <!-- FIXME: Button to restore -->
            </div>
        </PopupElement>
    </div>
</template>
