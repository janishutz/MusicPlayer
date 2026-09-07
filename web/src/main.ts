import '@fortawesome/fontawesome-free/css/all.css';
import App from './App.vue';
import Notifications from '@kyvg/vue3-notification';
import {
    createApp
} from 'vue';
import {
    createPinia
} from 'pinia';
import router from './router';

const app = createApp( App );

app.use( createPinia() );
app.use( router );
app.use( Notifications );

app.mount( '#app' );
