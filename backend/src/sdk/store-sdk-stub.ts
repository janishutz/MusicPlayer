interface StoreSDKConfig {
    'backendURL': string;
    'signingSecret': string;
    'name': string;
    'loglevel': 'debug' | 'info' | 'log' | 'warn' | 'error' | 'none';
}

interface SubscriptionData {
    'id': string;
    'status': string;
    'expires': number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSubscriptions = async ( _uid: string ): Promise<SubscriptionData[]> => {
    return [ {
        'id': 'com.janishutz.MusicPlayer.subscription',
        'expires': new Date().getTime() + 200000,
        'status': 'active'
    } ];
};

const configure = ( config: StoreSDKConfig ) => {
    console.log( config );
};

export default {
    getSubscriptions,
    configure
};
