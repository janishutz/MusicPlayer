<script setup lang="ts">
    import {
        type ComputedRef,
        computed,
        onMounted,
        ref
    } from 'vue';
    import {
        currentQueue,
        currentQueueIdx,
        enableFancyBackground,
        isAntiTamperEnabled,
        isPlaying,
        playbackOffset,
        playbackProgress,
        playbackTime,
        popupMsg,
        popupTitle,
        showInfoPopup,
        startTime
    } from '@/ts/shared/state';
    import BackgroundAnimation from '@/components/shared/BackgroundAnimation.vue';
    import CurrentSong from '@/components/player/CurrentSong.vue';
    import InformationPopup from '@/components/shared/InformationPopup.vue';
    import ProgressBar from '@/components/player/ProgressBar.vue';
    import SettingsPopup from '@/components/shared/SettingsPopup.vue';
    import SharedQueue from '@/components/shared/SharedQueue.vue';
    import type {
        Song
    } from '@/ts/dtype/playlist';
    import {
        beautifyTime
    } from '@/ts/util/time';
    import shared from '@/ts/shared';

    shared.connect();

    const lightTheme = ref( localStorage.getItem( 'shared-theme' ) === 'light' );
    const compactLayout = ref( false );
    const showSettings = ref( false );

    const changeTheme = () => {
        lightTheme.value = !lightTheme.value;
        localStorage.setItem( 'shared-theme', lightTheme.value ? 'light' : 'dark' );
    };

    const openSettings = () => showSettings.value = true;

    onMounted( () => {
        setInterval( () => {
            if ( !isPlaying.value ) return;

            playbackTime.value = ( ( new Date().getTime() - startTime.value ) / 1000 ) + playbackOffset.value;
            playbackProgress.value = playbackTime.value / song.value.duration;

            if ( playbackTime.value > song.value.duration ) {
                playbackOffset.value -= song.value.duration;

                if ( currentQueueIdx.value < currentQueue.value.length - 1 )
                    currentQueueIdx.value++;
                else {
                    playbackTime.value = song.value.duration;
                    isPlaying.value = false;
                }
            }
        }, 250 );
        document.getElementById( 'theme-selector' )!.style = 'display: none;';
        document.getElementById( 'theme-selection-panel' )!.style = 'display: none;';
    } );
    const song: ComputedRef<Song> = computed( () => {
        if ( currentQueueIdx.value >= 0 && currentQueue.value.length > currentQueueIdx.value )
            return currentQueue.value[currentQueueIdx.value]!;
        else
            return {
                'artist': 'No artist',
                'duration': -1,
                'name': 'Not playing',
                'artwork': '',
                'additional-info': 'Test',
                'identifier': 'nosong-ident',
                'source': 'local'
            };
    } );
</script>

<template>
    <div
        :class="[
            'shared-view',
            'theme-shared-' + (lightTheme && !enableFancyBackground ? 'light' : 'dark'),
        ]"
    >
        <BackgroundAnimation v-if="enableFancyBackground" :image="song.artwork" />
        <div class="credits">
            <a href="https://github.com/janishutz/MusicPlayer">MusicPlayer</a> created by <a href="https://janishutz.com">Janis Hutz</a> (without any AI)
        </div>
        <i
            v-if="!enableFancyBackground"
            id="shared-theme-selector"
            :class="['fa-solid', lightTheme ? 'fa-sun' : 'fa-moon']"
            @click="changeTheme"
        ></i>
        <i
            v-if="isAntiTamperEnabled"
            id="anti-tamper-symbol"
            class="fa-solid fa-lock"
            title="Anti-Tamper is enabled. Tampering with this screen in any way will send a notification to the admin"
        ></i>
        <i
            id="settings-symbol"
            class="fa-solid fa-gear"
            @click="openSettings"
        ></i>
        <InformationPopup v-model="showInfoPopup" :title="popupTitle" :msg="popupMsg" />
        <SettingsPopup v-model="showSettings" />

        <div id="shared-song-panel" :class="['panel', compactLayout ? 'compact' : undefined] ">
            <div class="current-song-wrapper">
                <CurrentSong v-model="song" :show-additional-info="true" :compact-layout="compactLayout" />
            </div>
            <ProgressBar
                v-model="playbackProgress"
                :disallow-move="true"
                :light-mode="lightTheme && !enableFancyBackground ? 'light' : 'dark'"
            />
            <div class="time">
                <p class="current">
                    {{ beautifyTime( song.duration >= 0 ? playbackTime : -1 ) }}
                </p>
                <p class="duration">
                    {{ beautifyTime( song.duration ) }}
                </p>
            </div>
        </div>
        <div id="shared-queue" class="panel">
            <SharedQueue v-model="compactLayout" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @use '@/scss/shared/main.scss';
</style>
