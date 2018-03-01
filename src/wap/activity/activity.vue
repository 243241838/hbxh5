<template>
    <div id="body" class="container" :style="{'background':bodyColor}">
        <div class="banner">
            <img @load="setBodyColor(src)" class="bannerImg" :src="src" alt="">
        </div>
        <ul class="list clear">
            <li class="item" v-for="i in 6">
                <img :src="src2" alt="">
                <div class="content">
                    <h3>少儿意外健康综合险</h3>
                    <p class="text-item">sdfsd</p>
                    <p class="text-item">投保</p>
                    <p class="text-box">
                        <span class="moneyUnit">￥</span>
                        <span class="money">{{money | formatMoney}}</span>
                        起
                        <span class="fr mount" :class="{'tuiguang': true}">sdf</span>
                    </p>
                </div>
            </li>
        </ul>
        <div class="activity">
            <h2>活动规则</h2>
            <p v-for="(item,index) in ['a','b','c','d']" :class="{'last':index == 3}">{{item}}.Flex是Flexible Box的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。</p>
        </div>
    </div>
</template>
<script>
import Mydropload from 'js/mydropload.js';
import request from 'js/interface/request';
import { Common } from 'js/common.js';
import toast from '../../components/toast';
export default {
    components: {
        toast
    },
    data () {
        return {
            toast: {
                isshow: false,
                message: ''
            },
            src: require('./images/banner2.jpg'),
            src2: require('./images/1.png'),
            bodyColor: '#fff',
            money: 234300
        }
    },
    created () {
    },
    mounted () {
        this.getData();
    },
    computed: {
    },
    methods: {
        getData () {
            // request.getSpecialDetail(obj, (response) => {
            //     if () {
            //     }
            // }, (error) => {
            // })
        },
        // 设置背景颜色
        setBodyColor (src) {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let img = new window.Image();
            img.src = src;
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            let imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let data = imgdata.data;
            console.log(data.length);
            this.bodyColor = 'rgba(' + data[data.length - 4] + ',' + data[data.length - 3] + ',' + data[data.length - 2] + ',' + 1 + ')';
            this.resetBody();
        },
        showtoast (msg, isshow) {
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        resetBody () {
            this.$nextTick(() => {
                Common.setFullScreen(document.getElementById('body'))
            })
        }
    },
    filters: {
        formatMoney (value) {
            if (!value) {
                return '';
            }
            return parseFloat(value / 100);
        }
    }
}
</script>