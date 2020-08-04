<script>
    import element from "../mixins/element";

    export default {
        name: 'RoughCircle',
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
            diameter: {
                type: Number,
                default: 0
            }
        },
        methods: {
            handler(forceRender = false) {
                this.createElement('circle', [this.x, this.y, this.diameter], forceRender);
            }
        }
    };
</script>
