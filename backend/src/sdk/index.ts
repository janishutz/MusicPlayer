import loginSdk from '@janishutz/login-sdk-server';
import loginSdkStub from '@janishutz/login-sdk-server-stubs';
import storeSdk from '@janishutz/store-sdk';
import storeSdkStub from './store-sdk-stub';

export const getLoginSdk = ( foss: boolean ) => {
    if ( foss ) return loginSdkStub;
    else return loginSdk;
};

export const getStoreSdk = ( foss: boolean ) => {
    if ( foss ) return storeSdkStub;
    else return storeSdk;
};
