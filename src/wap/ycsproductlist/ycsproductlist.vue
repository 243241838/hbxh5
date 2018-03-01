<template>
 <div class="body" id="body">
        <div class="nav" :class="{isWeiXin:isWeiXin}">
            <div class="type-content">
                <ul class="type-list">
                    <li v-for="(item,idx) in headNav" v-text="item.name" :class="{cur:idx==index}" @click="nav(idx)"></li>
                </ul>
            </div>
        </div>
        <!--
        <div class="list" v-show="index==0">
            <div class="item flexbox" v-for="item in family" @click="go_url(item.url)">
                <div class="left">
                    <img :src="item.img" alt="">
                    <div v-text="item.name"></div>
                </div>
                <div class="right flex">
                    <div class="head" v-text="item.head"></div>
                    <div class="text" v-text="item.text"></div>
                    <div class="flexbox">
                        <div class="money">
                            <span class="green1">￥</span>
                            <span class="money1" v-text="item.money"></span>
                            <span class="gray">起</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        -->
        <!--
        <div class="list" v-show="index==1">
            <div class="item flexbox" v-for="item in travel" @click="go_url(item.url)">
                <div class="left">
                    <img :src="item.img" alt="">
                    <div v-text="item.name"></div>
                </div>
                <div class="right flex">
                    <div class="head" v-text="item.head"></div>
                    <div class="text" v-text="item.text"></div>
                    <div class="flexbox">
                        <div class="money">
                            <span class="green1">￥</span>
                            <span class="money1" v-text="item.money"></span>
                            <span class="gray">起</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        -->
        <!--
        <div class="list" v-show="index==2">
            <div class="item flexbox" v-for="item in steer" @click="go_url(item.url)">
                <div class="left">
                    <img :src="item.img" alt="">
                    <div v-text="item.name"></div>
                </div>
                <div class="right flex">
                    <div class="head" v-text="item.head"></div>
                    <div class="text" v-text="item.text"></div>
                    <div class="flexbox">
                        <div class="money">
                            <span class="green1">￥</span>
                            <span class="money1" v-text="item.money"></span>
                            <span class="gray">起</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        -->
        <div class="list" v-show="index==0">
            <div class="item flexbox" v-for="item in person" @click="go_url(item.url)">
                <div class="left">
                    <img :src="item.img" alt="">
                    <div v-text="item.name"></div>
                </div>
                <div class="right flex">
                    <div class="head" v-text="item.head"></div>
                    <div class="text" v-text="item.text"></div>
                    <div class="flexbox">
                        <div class="money">
                            <span class="green1">￥</span>
                            <span class="money1" v-text="item.money"></span>
                            <span class="gray">起</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="list" v-show="index==1">
            <div class="item flexbox" v-for="item in fitness" @click="go_url(item.url)">
                <div class="left">
                    <img :src="item.img" alt="">
                    <div v-text="item.name"></div>
                </div>
                <div class="right flex">
                    <div class="head" v-text="item.head"></div>
                    <div class="text" v-text="item.text"></div>
                    <div class="flexbox">
                        <div class="money">
                            <span class="green1">￥</span>
                            <span class="money1" v-text="item.money"></span>
                            <span class="gray">起</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="list" v-show="index==2">
            <div class="item flexbox" v-for="item in life" @click="go_url(item.url)">
                <div class="left">
                    <img :src="item.img" alt="">
                    <div v-text="item.name"></div>
                </div>
                <div class="right flex">
                    <div class="head" v-text="item.head"></div>
                    <div class="text" v-text="item.text"></div>
                    <div class="flexbox">
                        <div class="money">
                            <span class="green1">￥</span>
                            <span class="money1" v-text="item.money"></span>
                            <span class="gray">起</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {valid} from 'js/common';
export default {
    components: {
    },
    data () {
        return {
            index: 0,
            isWeiXin: '',
            headNav: [
                // { name: '家财险' },
                // { name: '旅游险' },
                // {name: '驾意险'},
                {name: '意外险'},
                {name: '健康险'},
                {name: '寿险'},
                {name: '车险'}
            ],
            //家庭险
            // family: [
            //     {img: require('./images/family1.jpg'), name: '太平洋财险', head: '全能卫士家财纪念版', text: '人屋同保，快乐出行', money: '25', url: 'https://m.ecpic.com.cn/mobilemsb/product/initPrd?mId=657940&vCode=332914'},
            //     {img: require('./images/family2.jpg'), name: '太平洋财险', head: '全能卫士家庭保险综合版', text: '百万升价护卫队，住的安心宅的放心', money: '25', url: 'https://m.ecpic.com.cn/mobilemsb/product/initPrd?mId=657960&vCode=193314'}
            // ],
            //旅游险
            // travel: [
            //     {img: require('./images/travel1.jpg'), name: '太平洋财险', head: '乐游人生', text: '地球那么大，保你任性游', money: '4', url: 'https://m.ecpic.com.cn/mobilemsb/product/initPrd?mId=657978&vCode=163614'},
            //     {img: require('./images/travel2.jpg'), name: '太平洋财险', head: '境外旅游险', text: '1元1天，畅游内外', money: '1', url: 'https://m.ecpic.com.cn/mobilemsb/product/initPrd?mId=657989&vCode=493814'},
            //     {img: require('./images/travel3.jpg'), name: '太平洋财险', head: '境内旅游意外险', text: '保单在收，说走就走', money: '1', url: 'https://m.ecpic.com.cn/mobilemsb/product/initPrd?mId=657997&vCode=564014'}
            // ],
            //驾驶意外险
            // steer: [
            //     {img: require('./images/steer1.jpg'), name: '太平洋财险', head: '乐驾人生', text: '乐享保险，驾驭人生', money: '16', url: 'https://m.ecpic.com.cn/mobilemsb/product/initPrd?mId=658000&vCode=174214'},
            //     {img: require('./images/steer2.jpg'), name: '太平洋财险', head: '驾乘人员意外伤害保险', text: '驾乘均保，全年365天持久守护', money: '220', url: 'https://m.ecpic.com.cn/mobilemsb/product/initPrd?mId=658008&vCode=324314#/mobilemsb/product/initPrd?mId=658008&vCode=324314'}
            // ],
            //人身意外险
            person: [
                {img: require('./images/person1.jpg'), name: '众安', head: '众行天下综合意外保障计划', text: '超高性价比，一次投保，全年无忧', money: '100', url: 'https://sky.zhongan.com/iybsky/view/m/product/estimate/estimate.html?product_id=1005845&accountId=505120795'},
                {img: require('./images/person2.jpg'), name: '众安', head: '孝欣保 老年综合意外险', text: '老年专属，0免赔，不限社保', money: '200', url: 'https://sky.zhongan.com/iybsky/view/m/product/estimate/estimate.html?product_id=1005842&accountId=505120795'},
                {img: require('./images/steer2.jpg'), name: '太平洋财险', head: '驾乘人员意外伤害保险', text: '驾乘均保，全年365天持久守护', money: '220', url: 'https://m.ecpic.com.cn/mobilemsb/product/initPrd?mId=658008&vCode=324314#/mobilemsb/product/initPrd?mId=658008&vCode=324314'}
            ],
            //健康
            fitness: [
                {img: require('./images/fitness1.jpg'), name: '众安', head: '尊享e生•重疾险', text: '“包治百病”的人生幸福守护师', money: '210', url: 'https://sky.zhongan.com/iybsky/view/m/product/estimate/estimate.html?product_id=1005840&accountId=505120795'},
                {img: require('./images/fitness3.jpg'), name: '众安', head: '尊享e生医疗保险（100万版）', text: '百万医疗，100%赔付，不限社保', money: '279', url: 'https://sky.zhongan.com/iybsky/view/m/product/estimate/estimate.html?product_id=1005839&accountId=505120795'},
                {img: require('./images/fitness4.jpg'), name: '众安', head: '尊享e生•全保通', text: '一张保单覆盖所有健康风险', money: '482', url: 'https://sky.zhongan.com/iybsky/view/m/product/estimate/estimate.html?product_id=1005841&accountId=505120795'}
                // {img: require('./images/fitness2.jpg'), name: '众安', head: '女性特定疾病保险', text: '女性特定疾病保险', money: '4.5', url: 'https://sky.zhongan.com/iybsky/view/m/product/estimate/estimate.html?product_id=1005843&accountId=505120795'},
                // {img: require('./images/fitness5.jpg'), name: '众安', head: '卓越优享 个人高端医疗保险', text: '个人高端医疗保险，你值得拥有', money: '3257', url: 'https://sky.zhongan.com/iybsky/view/m/product/estimate/estimate.html?product_id=1005844&accountId=505120795'},
            ],
            //寿险
            life: [
                {img: require('./images/life1.jpg'), name: '国华人寿', head: '一份保险，终身受益', text: '一份保险，终身受益', money: '3102', url: './product/guohua/productGhl.html'}
            ]
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    },
    mounted () {
    },
    computed: {
    },
    methods: {
        nav (idx) {
            if (parseInt(idx) === parseInt(this.headNav.length - 1)) {
                window.location.href = 'FQcarInfo.html';
                return false;
            }
            this.index = idx;
        },
        go_url (url) {
            window.location.href = url;
        }
    }
}
</script>