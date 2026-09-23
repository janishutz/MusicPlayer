import {
    currentQueue, currentQueueIdx, enableAntiTamper, isPlaying, playbackOffset, playbackProgress, playbackTime, startTime
} from './state';

export const reset = () => {
    currentQueue.value = [];
    isPlaying.value = false;
    currentQueueIdx.value = -1;
    startTime.value = new Date().getTime();
    enableAntiTamper.value = false;
    playbackOffset.value = 0;
    playbackTime.value = 0;
    playbackProgress.value = 0;
};
