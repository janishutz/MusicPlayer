import {
    queue,
    rawQueue,
    shuffle
} from '../player/state';

const savePlaylist = () => {
    rawQueue.value = queue.value;
    shuffle.value = false;
};
