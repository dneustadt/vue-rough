<template>
    <canvas>
        <slot v-if="rough" />
    </canvas>
</template>

<script>
    import rough from 'roughjs/bundled/rough.esm.js';

    export default {
        name: 'RoughCanvas',
        props: {
            config: Object
        },
        rendering: false,
        data() {
            return {
                rough: null
            };
        },
        mounted() {
            this.rough = rough.canvas(this.$el, this.config);

            this.$on('rerender', this.clearCanvas);
        },
        methods: {
            clearCanvas() {
                if (!this.rendering) {
                    this.rough.ctx.clearRect(0, 0, this.rough.canvas.width, this.rough.canvas.height);

                    this.$children.forEach((child) => {
                       child.handler(true);
                    });
                }
                this.rendering = true;

                this.$nextTick().then(() => {
                    this.rendering = false;
                });
            }
        }
    };
</script>
