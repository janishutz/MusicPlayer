import '@fortawesome/fontawesome-free/css/all.css';
import App from './App.vue';
import Notifications from '@kyvg/vue3-notification';
import {
    configure
} from '@janishutz/oidc-login-sdk-browser';
import {
    createApp
} from 'vue';
import {
    createPinia
} from 'pinia';
import router from './router';

configure( {
    'backendURL': new URL( import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8080' ),
    'defaultAuthErrorResolution': 'resolve'
} );

const app = createApp( App );

app.use( createPinia() );
app.use( router );
app.use( Notifications );

app.mount( '#app' );
