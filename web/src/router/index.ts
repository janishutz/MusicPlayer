import {
    createRouter,
    createWebHistory
} from 'vue-router';
import {
    useAuthStore
} from '@/stores/authstore';

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

router.beforeEach( to => {
    const store = useAuthStore();

    if ( to.meta.auth && !store.isAuth ) {
        return {
            'name': 'home'
        };
    } else if ( to.name === 'home' && store.isAuth ) {
        return {
            'name': 'app'
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
