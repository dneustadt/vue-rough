<template>
    <svg
        :width="width"
        :height="height"
        ref="svgElement"
    >
        <slot v-if="rough" />
    </svg>
</template>

<script>
    import { ref, onMounted } from 'vue';
    import rough from 'roughjs/bundled/rough.esm.js';

    export default {
        name: 'RoughSvg',
        props: {
            width: String,
            height: String,
            config: Object
        },
        setup(props) {
            const svgElement = ref(null);
            const rough = ref(null);

            onMounted(() => {
                rough.value = rough.svg(svgElement.value, props.config);
            });

            const append = (child) => {
                svgElement.value.appendChild(child);
            }

            const remove = (child) => {
                svgElement.value.removeChild(child);
            }

            return { rough, append, remove };
        }
    };
</script>
