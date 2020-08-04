<script>
    import element from "../mixins/element";

    export default {
        name: 'RoughLinearPath',
        mixins: [ element ],
        props: {
            points: Array
        },
        methods: {
            handler(forceRender = false) {
                this.createElement('linearPath', [this.points], forceRender);
            }
        }
    };
</script>
