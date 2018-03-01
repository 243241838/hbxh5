<template>
    <div class="layer-box layer-box0" v-if="layerOptions.isshow">
        <div class="layer-shade" @click="onlayerback('confirm','shade')"></div>
        <div class="layer-main">
            <div class="section">
                <div class="layer-child layer-manim " style="">
                    <h1 class="layer-title" v-html="layerOptions.title"></h1>
                    <button class="layer-end" v-if="layerOptions.type === 'prop'" @click="onlayerback('confirm')"></button>
                    <div class="layer-cont" v-html="layerOptions.message">
                    </div>
                    <div class="layer-fbtn" v-if="layerOptions.type != 'prop'">
                        <span v-if="layerOptions.type === 'confirm'">
                            <div class="btn btncancel" @click="onlayerback('cancel')">{{ cancelBtn }}</div>
                        </span>
                        <span>
                            <div class="btn btnok" @click="onlayerback('confirm')">{{ confirmBtn }}</div>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'layer',
    props: {
        layerOptions: {
            type: Object
        }
    },
    computed: {
        confirmBtn () { // 确认
            var str = '';
            if (this.layerOptions.type === 'alert') {
                str = this.layerOptions.btns[0];
            } else if (this.layerOptions.type === 'confirm') {
                str = this.layerOptions.btns[1];
            }
            return str;
        },
        cancelBtn () { // 取消
            var str = '';
            if (this.layerOptions.type === 'confirm') {
                str = this.layerOptions.btns[0];
            }
            return str;
        }
    },
    methods: {
        onlayerback (msg, shade) { // 点击蒙版
            if (shade && this.layerOptions.shadeClose) {
                this.layerOptions.isshow = false;
                return;
            }
            if (!shade) { // 点击非蒙版
                this.layerOptions.isshow = false;
                this.$emit('onlayerback', msg);
            }
        }
    }
}
</script>
