<template>
    <svg>
        <slot v-if="rough" />
    </svg>
</template>

<script>
    import rough from 'roughjs/bundled/rough.esm.js';

    export default {
        name: 'RoughSvg',
        props: {
            config: Object
        },
        data() {
            return {
                rough: null
            };
        },
        mounted() {
            this.rough = rough.svg(this.$el, this.config);
        },
        methods: {
            append(child) {
                this.$el.appendChild(child);
            },
            remove(child) {
                this.$el.removeChild(child);
            }
        }
    };
</script>
