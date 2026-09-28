<script setup lang="ts">
    import {
        onMounted,
        ref,
        useTemplateRef,
        watch
    } from 'vue';
    import {
        getPalette
    } from 'colorthief';

    const props = defineProps<{
        'image'?: string
    }>();
    const loader = useTemplateRef( 'loader-image' );
    const bgGradient = ref( 'conic-gradient( blue, green, red, blue )' );

    const loadImage = async () => {
        if ( !props.image ) return;

        loader.value!.src = props.image;

        loader.value!.onload = async () => {
            const cols = await getPalette( loader.value!, {
                'colorCount': 5
            } );

            bgGradient.value = `conic-gradient( ${ cols?.map( v => {
                const col = v.rgb();

                return `rgb(${ col.r }, ${ col.g }, ${ col.b })`;
            } )
                .reduce( ( prev, val ) => prev + ', ' + val ) } )`;
        };
    };

    onMounted( () => {
        loadImage();
    } );

    watch( props, () => {
        loadImage();
    } );
</script>

<template>
    <div>
        <img ref="loader-image" crossorigin="anonymous" hidden>
        <div :style="`background: ${bgGradient};`" class="radial-bg"></div>
    </div>
</template>

<style lang="scss" scoped>
.radial-bg {
    width: 200vw;
    height: 200vw;
    left: -50vw;
    top: calc(-50vw - 50vh);
    position: fixed;
    z-index: 1;
    filter: blur(30px) brightness(0.4);
    animation: gradientAnim 20s infinite linear;
    background: conic-gradient( blue, green, red, blue );
}

@keyframes gradientAnim {
    from {
        transform: rotate( 0deg );
    }
    to {
        transform: rotate( 360deg );
    }
}
</style>
