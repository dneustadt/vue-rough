<script>
    import element from "../mixins/element";

    export default {
        name: 'RoughArc',
        mixins: [ element ],
        props: {
            x: {
                type: Number,
                default: 0,
                required: true
            },
            y: {
                type: Number,
                default: 0,
                required: true
            },
            width: {
                type: Number,
                default: 0,
                required: true
            },
            height: {
                type: Number,
                default: 0,
                required: true
            },
            start: {
                type: Number,
                default: 0,
                required: true
            },
            stop: {
                type: Number,
                default: 0,
                required: true
            },
            closed: {
                type: Boolean,
                default: false,
                required: true
            }
        },
        methods: {
            handler(forceRender = false) {
                this.createElement('arc', [this.x, this.y, this.width, this.height, this.start, this.stop, this.closed], forceRender);
            }
        }
    };
</script>
