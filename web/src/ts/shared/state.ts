import {
    type Ref,
    ref,
    watch
} from 'vue';
import type {
    Song
} from '../dtype/playlist';

export const currentQueue: Ref<Song[]> = ref( [] );

export const isPlaying = ref( false );

export const currentQueueIdx = ref( -1 );

export const startTime = ref( new Date().getTime() );

export const showArtworks = ref( location.pathname.includes( 'fancy' ) );

export const enableFancyBackground = ref( location.pathname.includes( 'fancy' ) );

export const backgroundAnimationTypes = [
    'image',
    'radial'
] as const;

export const backgroundAnimation: Ref<typeof backgroundAnimationTypes[number]> = ref( 'image' );

export const isAntiTamperPossiblePage = location.pathname.startsWith( '/fancy' );

/** True if anti-tamper is available */
export const isAntiTamperAvailable = ref( false );

/** True if user allowed anit-tamper */
export const allowAntiTamper = ref( sessionStorage.getItem( 'anti-tamper-allowed' ) === 'true' );

watch( allowAntiTamper, () => {
    sessionStorage.setItem( 'anti-tamper-allowed', String( allowAntiTamper.value ) );
} );

/** True if it is active */
export const isAntiTamperActive = ref( false );

export const playbackTime = ref( 0 );

export const playbackOffset = ref( 0 );

export const playbackProgress = ref( 0 );

export const popupTitle = ref( '' );

export const popupMsg = ref( '' );

export const showInfoPopup = ref( false );

export const hideBranding = ref( false );

export const clientName = ref( sessionStorage.getItem( 'anti-tamper-client-name' ) ?? '' );

watch( clientName, () => {
    sessionStorage.setItem( 'anti-tamper-client-name', String( clientName.value ) );
} );
