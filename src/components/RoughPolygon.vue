<script>
    import element from "../mixins/element";

    export default {
        name: 'RoughPolygon',
        mixins: [ element ],
        props: {
            vertices: {
                type: Array,
                required: true
            }
        },
        methods: {
            handler(forceRender = false) {
                this.createElement('polygon', [this.vertices], forceRender);
            }
        }
    };
</script>
