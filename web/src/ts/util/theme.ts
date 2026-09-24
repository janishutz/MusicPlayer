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
// TODO: Detect light or dark theme preference from browser and store
const darkMode: Ref<boolean> = ref( localStorage.getItem( 'theme-mode' ) !== 'light' );
const selectedTheme = ref( themes.value[ 0 ]! );

let currTheme = '';

const formatThemeName = ( base: string ) => {
    return 'theme-' + base.toLowerCase() + '-' + ( darkMode.value ? 'dark' : 'light' );
};

watch( [
    selectedTheme,
    darkMode
], () => {
    if ( formatThemeName( selectedTheme.value ) !== currTheme ) {
        console.log( 'updating theme' );
        document.documentElement.classList.remove( currTheme );
        currTheme = formatThemeName( selectedTheme.value );
        document.documentElement.classList.add( currTheme );
        localStorage.setItem( 'theme', selectedTheme.value );
    }
} );

const tempTheme = localStorage.getItem( 'theme' );

if ( tempTheme ) {
    if ( !themes.value.includes( tempTheme ) ) {
        localStorage.setItem( 'theme', selectedTheme.value );
        localStorage.setItem( 'theme-mode', selectedTheme.value );
        document.documentElement.classList.add( formatThemeName( themes.value[ 0 ]! ) );
    } else {
        selectedTheme.value = tempTheme;
        document.documentElement.classList.add( formatThemeName( selectedTheme.value ) );
    }
} else {
    document.documentElement.classList.add( formatThemeName( themes.value[ 0 ]!.toLowerCase() ) );
}

currTheme = formatThemeName( selectedTheme.value );
document.documentElement.classList.add( 'init-complete' );

export {
    themes,
    selectedTheme,
    darkMode
};
