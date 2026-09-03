// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSubscriptions = ( _uid: string ) => {
    return [ {
        'id': 'com.janishutz.MusicPlayer.subscription',
        'expires': new Date().getTime() + 200000,
        'status': true
    } ];
};

export default {
    getSubscriptions
};
