import {
    URL, fileURLToPath
} from 'node:url';
import {
    defineConfig
} from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig( {
    'plugins': [ vue() ],
    'css': {
        'preprocessorOptions': {
            'scss': {
                'additionalData': `
@use "@/scss/main.scss" as *;
`
            }
        }
    },
    'resolve': {
        'alias': {
            '@': fileURLToPath( new URL( './src', import.meta.url ) )
        }
    },
    'server': {
        'port': 8081
    }
} );
