<script>
    import element from "../mixins/element";

    export default {
        name: 'RoughEllipse',
        mixins: [ element ],
        props: {
            x: {
                type: Number,
                default: 0
            },
            y: {
                type: Number,
                default: 0
            },
            width: {
                type: Number,
                default: 0
            },
            height: {
                type: Number,
                default: 0
            }
        },
        methods: {
            handler(forceRender = false) {
                this.createElement('ellipse', [this.x, this.y, this.width, this.height], forceRender);
            }
        }
    };
</script>
