<template>
    <div id="body">
        <div class="swiper-container" id='swiper-my'>
                <div class='swiper-wrapper'>
                    <div class="swiper-slide">
                        <img src='./images/hands0.jpg' alt="">
                        <div>1<span>/</span>21</div>
                    </div>
                    <div class="swiper-slide">
                        <img src='./images/hands1.jpg' alt="">
                        <div>2<span>/</span>21</div>
                    </div>
                    <div class="swiper-slide">
                        <img src='./images/hands2.jpg' alt="">
                       <div>3<span>/</span>21</div>
                    </div>
                    <div class="swiper-slide">
                        <img src='./images/hands3.jpg' alt="">
                        <div>4<span>/</span>21</div>
                    </div>
                    <div class="swiper-slide">
                        <img src='./images/hands4.jpg' alt="">
                       <div>5<span>/</span>21</div>
                    </div>
                    <div class="swiper-slide">
                        <img src='./images/hands5.jpg' alt="">
                        <div>6<span>/</span>21</div>
                    </div>
                    <div class="swiper-slide">
                        <img src='./images/hands6.jpg' alt="">
                        <div>7<span>/</span>21</div>
                    </div>
                    <div class="swiper-slide">
                        <img src='./images/hands7.jpg' alt="">
                        <div>8<span>/</span>21</div>
                    </div>
                     <div class="swiper-slide">
                        <img src='./images/hands8.jpg' alt="">
                        <div>9<span>/</span>21</div>
                    </div>
                     <div class="swiper-slide">
                        <img src='./images/hands9.jpg' alt="">
                        <div>10<span>/</span>21</div>
                    </div>
                     <div class="swiper-slide">
                        <img src='./images/hands10.jpg' alt="">
                        <div>11<span>/</span>21</div>
                    </div>
                     <div class="swiper-slide">
                        <img src='./images/hands11.jpg' alt="">
                        <div>12<span>/</span>21</div>
                    </div>
                     <div class="swiper-slide">
                        <img src='./images/hands12.jpg' alt="">
                        <div>13<span>/</span>21</div>
                    </div>
                     <div class="swiper-slide">
                        <img src='./images/hands13.jpg' alt="">
                        <div>14<span>/</span>21</div>
                    </div>
                     <div class="swiper-slide">
                        <img src='./images/hands14.jpg' alt="">
                        <div>15<span>/</span>21</div>
                    </div>
                     <div class="swiper-slide">
                        <img src='./images/hands15.jpg' alt="">
                        <div>16<span>/</span>21</div>
                    </div>
                     <div class="swiper-slide">
                        <img src='./images/hands16.jpg' alt="">
                        <div>17<span>/</span>21</div>
                    </div>
                     <div class="swiper-slide">
                        <img src='./images/hands17.jpg' alt="">
                        <div>18<span>/</span>21</div>
                    </div>
                     <div class="swiper-slide">
                        <img src='./images/hands18.jpg' alt="">
                        <div>19<span>/</span>21</div>
                    </div>
                     <div class="swiper-slide">
                        <img src='./images/hands19.jpg' alt="">
                        <div>20<span>/</span>21</div>
                    </div>
                    <div class="swiper-slide">
                        <img src='./images/hands20.jpg' alt="" @click="href_url()">
                        <div>21<span>/</span>21</div>
                    </div>
                </div>
                <!--左右导航-->
                <div class="swiper-button-prev">
                    <i class="iconfont">&#xe669;</i>
                </div>
                <div class="swiper-button-next">
                    <i class="iconfont">&#xe668;</i>
                </div>
        </div>
        <!--弹框组件-->
        <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <loading :isshow='loading'></loading>
    </div>
</template>
<script>
import Swiper from 'swiper';
import {Common, storage, valid} from 'js/common'
import loading from '../../components/loading';
import toast from '../../components/toast' // toast引用：
import layer from '../../components/layer';
import request from 'js/interface/request';
import weixinSDK from 'js/weixinSDK';
export default {
    components: {
        toast,
        loading,
        layer
    },
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            layer: { // layer引用：2.属性
                isshow: false, // 是否打开弹框
                btns: [], // 弹框按钮名称
                type: 'alert', // 类型：'alert'/'confirm'/'prop'
                message: '', // 内容
                shadeClose: false, // 是否点击遮罩时关闭层
                yes: function () {}, // 确认回调
                no: function () {} // 取消回调
            },
            img: './images/hands',
            loading: false // 加载中

        }
    },
    created () {
    },
    mounted () {
        this.$nextTick(() => {
            this.banner();
        })
        Common.setFullScreen(document.getElementById('body'))
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
    },
    watch: {
    },
    methods: {
        initWeixinSDK () {
            let obj = {
                url: window.location.href
            }
            request.getWXJsAPISignature(obj, (response) => {
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    if (window.wx) {
                        // 微信配置
                        weixinSDK.config(window.wx, output);
                        weixinSDK.ready(window.wx, () => {
                            // 判断当前客户端版本是否支持指定JS接口
                            weixinSDK.checkJsApi(window.wx);
                            // 分享
                            weixinSDK.initShare(window.wx, 4);
                        });
                    }
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        // 轮播图
        banner () {
            let swiper = new Swiper('.swiper-container', {
                prevButton: '.swiper-button-prev',
                nextButton: '.swiper-button-next'
            });
        },
        href_url () {
            window.location.href = 'FQcarInfo.html';
            return false;
        },
        resetBody () {
            this.$nextTick(() => {
                Common.setFullScreen();
            })
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        // 点击确定弹窗
        confirmFun () {
            this.confirmShow('此车已有报价结果');
        },
        confirmShow (val) { // confirm实例
            let that = this;
            this.showLayer(val, {
                type: 'confirm',
                btns: ['重新报价', '去看看'],
                yes: function () {
                    that.mony_lsit()
                },
                no: function () {
                    window.location.href = 'FQcarInsure.html';
                    return false;
                }
            })
        },
        showLayer (msg, options) {
            // layer引用：3.显示弹框
            this.layer.type = options.type;
            this.layer.message = msg;
            this.layer.isshow = true;
            this.layer.shadeClose = options.shadeClose;
            this.layer.btns = options.btns;
            this.layer.yes = options.yes;
            this.layer.no = options.no;
        },
        closeLayer (type, shade) {
            // layer引用：4.回调函数
            if (type === 'cancel') {
                this.layer.no && this.layer.no();
            } else {
                this.layer.yes && this.layer.yes();
            }
        },
        alertShow (value) {
            this.showLayer(value, {
                type: 'alert', // 必填
                btns: ['我知道啦'], // 必填
                yes: () => { // 选填
                    storage.set('prevPage', './FQgreenHands.html');
                    window.location.href = './FQLogin.html';
                    return false;
                }
            })
        },
        multiLogin (response) {
            if (response.data.respCode === '100106') {
                this.loading = false;
                if (valid.isWeiXin()) {
                    weixinSDK.getAccessNone(window.location.href);
                } else {
                    this.alertShow(response.data.respMsg)
                }
                return false;
            } else if (response.data.respCode !== '000000' && response.data.respCode !== '900001') {
                this.showtoast(response.data.respMsg, true);
            }
        }
    },
    filters: {
    }
}
</script>
