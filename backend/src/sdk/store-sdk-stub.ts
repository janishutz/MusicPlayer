interface StoreSDKConfig {
    'backendURL': string;
    'signingSecret': string;
    'name': string;
    'loglevel': 'debug' | 'info' | 'log' | 'warn' | 'error' | 'none';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSubscriptions = ( _uid: string ) => {
    return [ {
        'id': 'com.janishutz.MusicPlayer.subscription',
        'expires': new Date().getTime() + 200000,
        'status': true
    } ];
};

const configure = ( _config: StoreSDKConfig ) => {}

export default {
    getSubscriptions,
    configure
};
