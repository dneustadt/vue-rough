<script>
    import element from "../mixins/element";

    export default {
        name: 'RoughRectangle',
        mixins: [ element ],
        props: {
            x1: {
                type: Number,
                default: 0
            },
            y1: {
                type: Number,
                default: 0
            },
            x2: {
                type: Number,
                default: 0
            },
            y2: {
                type: Number,
                default: 0
            }
        },
        mounted() {
            this.$watch('$props', () => { this.handler() }, { deep: true });
            this.handler();
        },
        methods: {
            handler(forceRender = false) {
                this.createElement('rectangle', [this.x1, this.y1, this.x2, this.y2], forceRender);
            }
        },
        render() {
            return this.$scopedSlots;
        }
    };
</script>
