<script>
    import element from "../mixins/element";

    export default {
        name: 'RoughCircle',
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
            diameter: {
                type: Number,
                default: 0,
                required: true
            }
        },
        methods: {
            handler(forceRender = false) {
                this.createElement('circle', [this.x, this.y, this.diameter], forceRender);
            }
        }
    };
</script>
