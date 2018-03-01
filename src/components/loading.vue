<template>
    <div class="gif-loading" v-if='isshow'>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'loading',
    props: {
        isshow: Boolean
    },
    data () {
        return {
        }
    }
}
</script>
<style lang="scss" scoped>
@charset "utf-8";
@import "../assets/scss/usage/layout/reset.scss";
.gif-loading
{
    position: fixed;
    z-index: 99999;
    top: -3rem;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width:1.4rem;
    height:1.4rem;
    background: url(../assets/images/loading.gif) no-repeat center center;
    background-size: 100% 100%;
}
</style>

