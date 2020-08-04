<script>
    import element from "../mixins/element";

    export default {
        name: 'RoughPath',
        mixins: [ element ],
        props: {
            d: {
                type: String,
                required: true
            }
        },
        methods: {
            handler(forceRender = false) {
                this.createElement('path', [this.d], forceRender);
            }
        }
    };
</script>
