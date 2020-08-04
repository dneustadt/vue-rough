<script>
    import element from "../mixins/element";

    export default {
        name: 'RoughCurve',
        mixins: [ element ],
        props: {
            points: {
                type: Array,
                required: true
            }
        },
        methods: {
            handler(forceRender = false) {
                this.createElement('curve', [this.points], forceRender);
            }
        }
    };
</script>
