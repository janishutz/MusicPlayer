import {
    type Ref,
    ref,
    watch
} from 'vue';

const themes: Ref<string[]> = ref( [
    'Blue',
    'Red',
    'Black',
    'Purple'
] );
const light: Ref<boolean> = ref( false );
const selectedTheme = ref( themes.value[ 0 ]! );

const formatThemeName = ( base: string ) => {
    return 'theme-' + base.toLowerCase() + '-' + ( light ? 'light' : 'dark' );
};

watch( selectedTheme, ( val, oldVal ) => {
    if ( val !== oldVal ) {
        document.documentElement.classList.remove( formatThemeName( oldVal ) );
        document.documentElement.classList.add( formatThemeName( val ) );
        document.dispatchEvent( new CustomEvent( 'eyetap:theme' ) );
        localStorage.setItem( 'theme', val );
    }
} );

const tempTheme = localStorage.getItem( 'theme' );

if ( tempTheme ) {
    if ( !themes.value.includes( tempTheme ) ) {
        localStorage.setItem( 'theme', selectedTheme.value );
        document.documentElement.classList.add( formatThemeName( themes.value[ 0 ]! ) );
    } else {
        selectedTheme.value = localStorage.getItem( 'theme' )!;
        document.documentElement.classList.add( formatThemeName( selectedTheme.value ) );
    }
} else {
    document.documentElement.classList.add( formatThemeName( themes.value[ 0 ]!.toLowerCase() ) );
}

document.documentElement.classList.add( 'init-complete' );

export {
    themes,
    selectedTheme,
    light
};
