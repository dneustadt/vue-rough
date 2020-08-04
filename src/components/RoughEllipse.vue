<script>
    import element from "../mixins/element";

    export default {
        name: 'RoughEllipse',
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
            }
        },
        methods: {
            handler(forceRender = false) {
                this.createElement('ellipse', [this.x, this.y, this.width, this.height], forceRender);
            }
        }
    };
</script>
