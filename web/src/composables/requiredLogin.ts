import {
    type Ref,
    ref,
    watch
} from 'vue';
import player from '@/ts/player';
import {
    sources
} from '@/ts/player/state';

export const showIsReconnecting = ref( false );

export const isShowingRequiredLoginView = ref( false );

export const requiredLoginsRawIdList: Ref<string[]> = ref( [] );

export const requiredLoginsList: Ref<{
    'id': string;
    'name': string;
    'icon'?: string;
}[]> = ref( [] );

export const openRequiredLoginManager = ( serviceList: string[] ) => {
    requiredLoginsList.value = [];
    isShowingRequiredLoginView.value = false;
    requiredLoginsRawIdList.value = serviceList;

    for ( const service of serviceList ) {
        const source = sources[service]!;

        if ( !source.authorized.value ) {
            requiredLoginsList.value.push( {
                'name': source.name,
                'id': service,
                'icon': source.icon
            } );

            watch( source.authorized, () => {
                openRequiredLoginManager( requiredLoginsRawIdList.value );
            } );
        }
    }

    if ( requiredLoginsList.value.length > 0 ) {
        isShowingRequiredLoginView.value = true;
    } else {
        if ( serviceList.length > 0 )
            player.playIndex( 0 );
    }
};

export const logIntoRequiredService = ( id: string ) => {
    sources[id]!.login!();
    // TODO: Play first song and open player and close popup when logged into all
};
