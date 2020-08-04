<script>
    import element from "../mixins/element";

    export default {
        name: 'RoughLine',
        mixins: [ element ],
        props: {
            x1: {
                type: Number,
                default: 0,
                required: true
            },
            y1: {
                type: Number,
                default: 0,
                required: true
            },
            x2: {
                type: Number,
                default: 0,
                required: true
            },
            y2: {
                type: Number,
                default: 0,
                required: true
            }
        },
        methods: {
            handler(forceRender = false) {
                this.createElement('line', [this.x1, this.y1, this.x2, this.y2], forceRender);
            }
        }
    };
</script>
