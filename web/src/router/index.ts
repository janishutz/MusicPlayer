import {
    useAuthStore
} from '@/stores/authstore';
import {
    createRouter, createWebHistory
} from 'vue-router';

const router = createRouter( {
    'history': createWebHistory( import.meta.env.BASE_URL ),
    'routes': [
        {
            'path': '/',
            'name': 'home',
            'component': () => import( '@/views/StartPage.vue' ),
            'meta': {
                'title': 'Home',
                'auth': false
            }
        },
        {
            'path': '/app',
            'name': 'app',
            'component': () => import( '@/views/AppView.vue' ),
            'meta': {
                'title': 'Player',
                'auth': true
            }
        },
        {
            'path': '/:pathMatch(.*)*',
            'name': 'NotFound',
            'component': () => import( '@/views/404View.vue' ),
            'meta': {
                'title': '404 :: Page not found',
                'transition': 'scale'
            }
        }
    ]
} );

router.beforeEach( ( to, from ) => {
    const store = useAuthStore();

    if ( to.meta.authRequired && !store.isAuth ) {
        return {
            'name': 'login'
        };
    } else if ( ( to.name === 'login' && store.isAuth ) || ( to.name === 'signup' && store.isAuth ) ) {
        return {
            'name': 'app-home'
        };
    }
} );

router.afterEach( to => {
    window.scrollTo( {
        'top': 0,
        'behavior': 'smooth'
    } );
    document.title = to.meta.title ? to.meta.title + ' - MusicPlayer' : 'MusicPlayer';
    // NProgress.done();
} );

export default router;
