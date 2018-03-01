<template>
    <div class="form-info" v-if='isshow'>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'totast',
    props: {
        isshow: Boolean,
        thetime: Number
    },
    data () {
        return {
            time: 3000 // 3s自动关闭
        }
    },
    watch: {
        isshow: function () {
            var _self = this;
            if (this.isshow) {
                setTimeout(function () {
                    _self.$emit('ontoastback');
                }, _self.time);
            }
        }
    }
}
</script>

