import {
    defineStore
} from 'pinia';
import {
    ref
} from 'vue';

export const useAuthStore = defineStore( 'authstore', () => {
    const isAuth = ref( false );

    return {
        isAuth
    };
} );
