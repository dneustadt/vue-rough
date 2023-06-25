export default {
    props: {
        roughness: Number,
        bowing: Number,
        seed: Number,
        stroke: String,
        strokeWidth: Number,
        fill: String,
        fillStyle: String,
        fillWeight: Number,
        hachureAngle: Number,
        hachureGap: Number,
        curveStepCount: Number,
        curveFitting: Number,
        strokeLineDash: Array,
        strokeLineDashOffset: Number,
        fillLineDash: Array,
        fillLineDashOffset: Number,
        disableMultiStroke: Boolean,
        disableMultiStrokeFill: Boolean,
        simplification: Number,
        dashOffset: Number,
        dashGap: Number,
        zigzagOffset: Number
    },
    data() {
        return {
            element: null
        };
    },
    mounted() {
        this.$watch('$props', () => { this.handler() }, { deep: true });
        this.handler();
    },
    render() {
        return this.$slots.default ? this.$slots.default() : [];
    },
    destroyed() {
        const rough = this.$parent.rough;
        if (rough.svg) {
            if (this.element) this.$parent.remove(this.element);
        } else {
            this.$parent.$emit('rerender');
        }
    },
    methods: {
        createElement: function (func, ops, forceRender = false) {
            const rough = this.$parent.rough;
            if (!rough) {
                console.error("Parent component does not provide a Rough.js instance.");
                return;
            }
            const props = Object.assign(
                {},
                ...Object.entries(this.$props).map(([key, value]) => (
                    value !== undefined && { [key]: value }
                ))
            );

            if (forceRender) {
                rough[func](...ops, props);

                return;
            }

            if (rough?.svg) {
                if (this.element) this.$parent.remove(this.element);

                this.element = rough[func](...ops, props);

                this.$parent.append(this.element);
            } else {
                this.$parent.$emit('rerender');
            }
        }
    }
}
