import {
    URL, fileURLToPath
} from 'node:url';
import {
    defineConfig,
    loadEnv
} from 'vite';
import {
    sentryVitePlugin
} from '@sentry/vite-plugin';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig( ( {
    mode
} ) => {
    const env = loadEnv( mode, process.cwd(), '' );
    const v = JSON.stringify( process.env.npm_package_version );

    return {
        'plugins': [
            vue(),
            sentryVitePlugin( {
                'project': env.BUGSINK_PROJ,
                'org': env.BUGSINK_ORG,
                'url': env.BUGSINK_URL,
                'debug': true,
                'authToken': env.BUGSINK_AUTH_TOKEN,
                'release': {
                    'name': v,
                    'create': false,
                    'finalize': false,
                    'inject': true
                },
                // optional: delete sourcemaps after upload so they are not served publicly
                'sourcemaps': {
                    'filesToDeleteAfterUpload': [ './dist/**/*.map' ]
                }
            } )
        ],
        'build': {
            'sourcemap': true
        },
        'define': {
            '__APP_VERSION__': v
        },
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
    };
} );
