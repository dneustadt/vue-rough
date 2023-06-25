<template>
    <canvas
        :width="width"
        :height="height"
        ref="canvasRef"
    >
        <slot v-if="rough" />
    </canvas>
</template>

<script>
import { ref, onMounted } from 'vue';
import rough from 'roughjs/bundled/rough.esm.js';

export default {
    name: 'RoughCanvas',
    props: {
        width: String,
        height: String,
        config: Object,
    },
    setup(props) {
        const canvasRef = ref(null);
        const roughInstance = ref(null);

        onMounted(() => {
            roughInstance.value = rough.canvas(canvasRef.value, props.config);
        });

        return {
            rough: roughInstance,
            canvasRef,
        };
    },
};
</script>
