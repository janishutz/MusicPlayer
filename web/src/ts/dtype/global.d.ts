import type {
    MusicKitObject
} from 'musickitjs-v3-types/MusicKit';

declare global {
    var MusicKit: MusicKitObject;
    interface GlobalEventHandlersEventMap {
        'musicplayer:playpause': CustomEvent<void>;
        'musicplayer:playindex': CustomEvent<void>;
        'musicplayer:seek': CustomEvent<void>;
    }
}
