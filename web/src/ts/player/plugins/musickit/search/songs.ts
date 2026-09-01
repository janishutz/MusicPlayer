import type {
    MusicKitInstance
} from 'musickitjs-v3-types/MusicKitInstance';

export const seachSongs = async ( instance: MusicKitInstance ) => {
    const search = async ( term: string ) => {
        const params = {
            'term': term,
            'types': [ 'songs' ],
            'l': 'en-us'
        };

        await instance.api.music( '/v1/catalog/{{storefrontId}}/search', params );
    };

    const addSelected = ( idx: number ) => {
        // TODO: Need to only return the selected song
        Promise.resolve();
    };
};
