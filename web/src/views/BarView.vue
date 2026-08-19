<script setup lang="ts">
    import {
        type Ref,
        computed, ref
    } from 'vue';

    interface FullConfig {
        'offering': Bars;
        'ages': Ages;
    }

    interface Bars {
        [name: string]: {
            'offering': BarConfig;
            'name': string;
            'id': string;
        }
    }

    interface Ages {
        '18+': string;
        '16-18': string;
    }

    interface BarConfig {
        [id: string]: Offer
    }

    interface Offer {
        'name': string;
        'price': number; // In cents
        'depot'?: number; // In cents
        'showLine'?: boolean;
        'id': string;
    }

    interface Selection {
        [id: string]: number;
    }

    const ages: Ref<Ages> = ref( {
        '18+': '',
        '16-18': '',
        'below': ''
    } );
    const offering: Ref<Bars> = ref( {} );
    const selection: Ref<Selection> = ref( {} );
    const selectedBar: Ref<string> = ref( '' );
    const enableDepotReminder = ref( true );

    let cashinInDepot = false;

    fetch( '/bar-config.json', {
        'cache': 'no-store'
    } ).then( res => {
        if ( res.status === 200 ) {
            res.json().then( json => {
                const data: FullConfig = json;

                offering.value = data.offering;
                ages.value = data.ages;
            } );
        } else {
            alert( 'Failed to load' );
        }
    } );

    const reset = ( skipCheck = true ) => {
        if ( !skipCheck && !Object.keys( offering.value ).includes( selectedBar.value ) ) return;

        if ( cashinInDepot && enableDepotReminder.value ) alert( 'Hand out chips for depot' );

        cashinInDepot = false;

        const keys = Object.keys( offering.value[ selectedBar.value ]!.offering );

        selection.value = {};

        keys.forEach( val => {
            selection.value[ val ] = 0;
        } );
    };

    const total = computed( () => {
        const keys = Object.keys( selection.value );

        let totalPrice = 0;
        let totalDepot = 0;

        for ( let i = 0; i < keys.length; i++ ) {
            const o = selection.value[ keys[ i ]! ]!;

            totalPrice += o * offering.value[ selectedBar.value ]!.offering[ keys[ i ]! ]!.price;
            totalDepot += o * ( offering.value[ selectedBar.value ]!.offering[ keys[ i ]! ]!.depot ?? 0 );
        }

        if ( totalDepot > 0 ) {
            cashinInDepot = true;
        }

        totalPrice += totalDepot;

        return ( totalPrice / 100 ) + ( totalDepot ? ` (Depot = ${ totalDepot })` : '' );
    } );

    const changeValue = ( id: string, amount: number ) => {
        selection.value[ id ]! += amount;

        if ( selection.value[ id ]! < 0 ) {
            selection.value[ id ] = 0;
        }
    };
</script>

<template>
    <div class="bar-utility">
        <div style="margin: 0">
            <label> Depot chips reminder</label>
            <input v-model="enableDepotReminder" type="checkbox">
        </div>
        <h1 style="margin: 15px;">
            Bar utility
        </h1>
        <div>
            <label for="bar-select">Select bar </label>
            <select id="bar-select" v-model="selectedBar" @change="reset()">
                <option v-for="bar in Object.values( offering )" :key="bar.id" :value="bar.id">
                    {{ bar.name }}
                </option>
            </select>
            <button @click="reset( false )">
                Reset
            </button>
        </div>
        <p>Check ages! (18+: {{ ages[ '18+' ] }}, 16-18: {{ ages[ '16-18' ] }})</p>
        <p v-if="Object.keys( offering ).includes( selectedBar )">
            Total: CHF {{ total }}
        </p>
        <table v-if="Object.keys( offering ).includes( selectedBar )" class="offering-wrapper">
            <tbody>
                <tr
                    v-for="offer in offering[ selectedBar ]!.offering"
                    :key="offer.id"
                    :class="[ 'offering', offer.showLine ? 'show-line' : '' ]"
                >
                    <td>
                        <p>
                            {{ offer.name }} (CHF {{ offer.price / 100 }}{{
                                offer.depot ? ' + ' + ( offer.depot / 100 ) : '' }})
                        </p>
                    </td>
                    <td>
                        <div>
                            <button class="inc-dec" @click="changeValue( offer.id, 1 )">
                                +
                            </button>
                            <p>{{ selection[ offer.id ] }}</p>
                            <button class="inc-dec" @click="changeValue( offer.id, -1 )">
                                -
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <p v-if="Object.keys( offering ).includes( selectedBar )">
            Total: CHF {{ total }}
        </p>
    </div>
</template>

<style lang="scss" scoped>
.bar-utility {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    >.offering-wrapper {
        border-collapse: collapse;
        margin-bottom: 5vh;

        .offering {
            &.show-line {
                >td {
                    border-bottom: solid 1px black;
                }
            }

            >td {
                padding: 5px;
                p {
                    margin: 0;
                    margin-right: 15px;
                    text-align: start;
                }

                >div {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: row;

                    p {
                        margin-left: 5px;
                        margin-right: 5px;
                    }

                    >.inc-dec {
                        user-select: none;
                        cursor: pointer;
                        background: none;
                        border: solid var( --primary-color ) 1px;
                        border-radius: 20px;
                        width: 2rem;
                        height: 2rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 1.5rem;
                        color: var( --primary-color );
                        touch-action: manipulation;
                    }
                }
            }
        }
    }
}
</style>
